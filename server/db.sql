DB_USER = postgres DB_PASSWORD = pgadmin DB_NAME = testdb2
CREATE TABLE
    users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        age INT,
        email VARCHAR(255),
        phone VARCHAR(15),
        difficulty VARCHAR(255) DEFAULT 'Beginner'
    );

--* Reading *--

CREATE TABLE
    Passages (
        passage_id VARCHAR(10) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,  -- Optional text content
        audio_url VARCHAR(255),
        difficulty VARCHAR(20) CHECK (
            difficulty IN ('Beginner', 'Intermediate', 'Advanced')
        )
        CHECK (
        (content IS NOT NULL AND audio_url IS NULL) OR
        (audio_url IS NOT NULL AND content IS NULL)
        )
    );

CREATE SEQUENCE beginner_passage_seq START 101;

CREATE SEQUENCE intermediate_passage_seq START 101;

CREATE SEQUENCE advanced_passage_seq START 101;


CREATE OR REPLACE FUNCTION generate_passage_id() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.difficulty = 'Beginner' THEN
        NEW.passage_id := 'B' || nextval('beginner_passage_seq');
    ELSIF NEW.difficulty = 'Intermediate' THEN
        NEW.passage_id := 'I' || nextval('intermediate_passage_seq');
    ELSIF NEW.difficulty = 'Advanced' THEN
        NEW.passage_id := 'A' || nextval('advanced_passage_seq');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER passage_id_trigger
BEFORE INSERT ON Passages
FOR EACH ROW
EXECUTE FUNCTION generate_passage_id();

CREATE TABLE MCQQuestions (
    question_id SERIAL PRIMARY KEY,
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    question_text TEXT,
    opt1 TEXT,
    opt2 TEXT,
    opt3 TEXT,
    opt4 TEXT,
    correct_answer VARCHAR(20) CHECK (correct_answer IN ('opt1', 'opt2', 'opt3', 'opt4'))
);

CREATE TABLE FillInTheBlanksQuestions (
    question_id SERIAL PRIMARY KEY,
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    question_text TEXT,
    correct_answer TEXT
);

CREATE TABLE TrueFalseQuestions (
    question_id SERIAL PRIMARY KEY,
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    question_text TEXT,
    correct_answer BOOLEAN
);

CREATE TABLE ImageIdentificationQuestions (
    question_id SERIAL PRIMARY KEY,
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    question_text TEXT,
    image_url TEXT,
    correct_answer TEXT
);

CREATE TABLE Passage_Reading_Progress (
    progress_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    score INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- Table to store questions related to each passage
CREATE TABLE
    questions (
        id SERIAL PRIMARY KEY,
        passage_id INT REFERENCES passages (id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        correct_option_id INT -- Store the correct option here
    );

-- Table to store the answer options for each question
CREATE TABLE
    options (
        id SERIAL PRIMARY KEY,
        question_id INT REFERENCES questions (id) ON DELETE CASCADE,
        option_text TEXT NOT NULL
    );

-- Table to store user responses and calculate their results
CREATE TABLE
    user_answers (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users (id) ON DELETE CASCADE,
        question_id INT REFERENCES questions (id) ON DELETE CASCADE,
        selected_option_id INT REFERENCES options (id) ON DELETE CASCADE,
        is_correct BOOLEAN NOT NULL
    );

INSERT INTO
    passages (title, content)
VALUES
    (
        'The Adventures of Tom Sawyer',
        'Tom Sawyer is a young boy living in Missouri who gets into all sorts of trouble. He loves adventures and hates school. One day, he meets a girl named Becky Thatcher and falls in love with her.'
    ),
    (
        'The Tale of Peter Rabbit',
        'Peter Rabbit is a mischievous young rabbit who disobeys his mother and sneaks into Mr. McGregor''s garden. He faces many dangers but learns valuable lessons about obedience.'
    ),
    (
        'The Ugly Duckling',
        'A duckling is teased for being different from the others. As he grows, he transforms into a beautiful swan, discovering that true beauty comes from within.'
    );

INSERT INTO
    questions (passage_id, question_text, correct_option_id)
VALUES
    (1, 'What is Tom Sawyer known for?', 1),
    (1, 'Who does Tom fall in love with?', 2),
    (2, 'What lesson does Peter Rabbit learn?', 3),
    (2, 'Who does Peter encounter in the garden?', 1),
    (
        3,
        'What does the ugly duckling eventually become?',
        2
    ),
    (3, 'What is the main theme of the story?', 1);

INSERT INTO
    options (question_id, option_text)
VALUES
    (1, 'Being adventurous'), -- Correct option for question 1
    (1, 'Being quiet'),
    (2, 'Becky Thatcher'), -- Correct option for question 2
    (2, 'Mary Ann'),
    (3, 'To be brave'),
    (3, 'To listen to his mother'), -- Correct option for question 3
    (4, 'Mr. McGregor'), -- Correct option for question 4
    (4, 'A fox'),
    (5, 'A lion'),
    (5, 'A swan'), -- Correct option for question 5
    (6, 'Embracing differences'), -- Correct option for question 6
    (6, 'Staying the same');

ALTER TABLE passages
ADD COLUMN user_id INT REFERENCES users (id) ON DELETE CASCADE,
ADD COLUMN read BOOLEAN DEFAULT FALSE;

INSERT INTO
    passages (title, content)
VALUES
    (
        'The Tale of Peter Rabbit',
        'Peter Rabbit is a mischievous young rabbit who disobeys his mother and sneaks into Mr. McGregor''s garden. He faces many dangers but learns valuable lessons about obedience.'
    );

INSERT INTO
    questions (passage_id, question_text, correct_option_id)
VALUES
    (1, 'What lesson does Peter Rabbit learn?', 3),
    (1, 'Who does Peter encounter in the garden?', 1);

INSERT INTO
    options (question_id, option_text)
VALUES
    (9, 'To be brave'),
    (9, 'To listen to his mother'), -- Correct option for question 3
    (10, 'Mr. McGregor'), -- Correct option for question 4
    (10, 'A fox');