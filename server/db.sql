-- Table to store the passages for reading tests
CREATE TABLE passages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);

-- Table to store questions related to each passage
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    passage_id INT REFERENCES passages(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    correct_option_id INT -- Store the correct option here
);

-- Table to store the answer options for each question
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL
);

-- Table to store user responses and calculate their results
CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id INT REFERENCES options(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL
);

INSERT INTO passages (title, content) VALUES
('The Adventures of Tom Sawyer', 'Tom Sawyer is a young boy living in Missouri who gets into all sorts of trouble. He loves adventures and hates school. One day, he meets a girl named Becky Thatcher and falls in love with her.'),
('The Tale of Peter Rabbit', 'Peter Rabbit is a mischievous young rabbit who disobeys his mother and sneaks into Mr. McGregor''s garden. He faces many dangers but learns valuable lessons about obedience.'),
('The Ugly Duckling', 'A duckling is teased for being different from the others. As he grows, he transforms into a beautiful swan, discovering that true beauty comes from within.');

INSERT INTO questions (passage_id, question_text, correct_option_id) VALUES
(1, 'What is Tom Sawyer known for?', 1), 
(1, 'Who does Tom fall in love with?', 2),
(2, 'What lesson does Peter Rabbit learn?', 3),
(2, 'Who does Peter encounter in the garden?', 1),
(3, 'What does the ugly duckling eventually become?', 2),
(3, 'What is the main theme of the story?', 1);

INSERT INTO options (question_id, option_text) VALUES
(1, 'Being adventurous'),        -- Correct option for question 1
(1, 'Being quiet'),
(2, 'Becky Thatcher'),           -- Correct option for question 2
(2, 'Mary Ann'),
(3, 'To be brave'),
(3, 'To listen to his mother'),  -- Correct option for question 3
(4, 'Mr. McGregor'),             -- Correct option for question 4
(4, 'A fox'),
(5, 'A lion'),
(5, 'A swan'),                   -- Correct option for question 5
(6, 'Embracing differences'),     -- Correct option for question 6
(6, 'Staying the same');

ALTER TABLE passages
ADD COLUMN user_id INT REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN read BOOLEAN DEFAULT FALSE;

INSERT INTO passages (title, content) VALUES
('The Tale of Peter Rabbit', 'Peter Rabbit is a mischievous young rabbit who disobeys his mother and sneaks into Mr. McGregor''s garden. He faces many dangers but learns valuable lessons about obedience.');

INSERT INTO questions (passage_id, question_text, correct_option_id) VALUES
(1, 'What lesson does Peter Rabbit learn?', 3),
(1, 'Who does Peter encounter in the garden?', 1);

INSERT INTO options (question_id, option_text) VALUES
(9, 'To be brave'),
(9, 'To listen to his mother'),  -- Correct option for question 3
(10, 'Mr. McGregor'),             -- Correct option for question 4
(10, 'A fox');