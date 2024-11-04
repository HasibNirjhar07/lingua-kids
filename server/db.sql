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