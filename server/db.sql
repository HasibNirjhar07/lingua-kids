DB_USER = postgres DB_PASSWORD = pgadmin DB_NAME = linguakids
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
        content TEXT,
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

CREATE TABLE Passage_Listening_Progress (
    progress_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    passage_id VARCHAR(10) REFERENCES Passages(passage_id),
    score INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
    Speaking_Content (
        content_id VARCHAR(10) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        difficulty VARCHAR(20) CHECK (
            difficulty IN ('Beginner', 'Intermediate', 'Advanced')
        )
    );

CREATE SEQUENCE beginner_speaking_seq START 101;

CREATE SEQUENCE intermediate_speaking_seq START 101;

CREATE SEQUENCE advanced_speaking_seq START 101;


CREATE OR REPLACE FUNCTION generate_speaking_id() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.difficulty = 'Beginner' THEN
        NEW.content_id := 'B' || nextval('beginner_speaking_seq');
    ELSIF NEW.difficulty = 'Intermediate' THEN
        NEW.content_id := 'I' || nextval('intermediate_speaking_seq');
    ELSIF NEW.difficulty = 'Advanced' THEN
        NEW.content_id := 'A' || nextval('advanced_speaking_seq');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER speaking_id_trigger
BEFORE INSERT ON Speaking_Content
FOR EACH ROW
EXECUTE FUNCTION generate_speaking_id();

CREATE TABLE Speaking_Progress (
    progress_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    content_id VARCHAR(10) REFERENCES Speaking_Content(content_id),
    score INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Writing_Prompt (
    prompt_id VARCHAR(10) PRIMARY KEY,
    prompt TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (
        difficulty IN ('Beginner', 'Intermediate', 'Advanced')
    )
);

CREATE TABLE Writing_Progress (
    progress_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    prompt_id VARCHAR(10) REFERENCES Writing_Prompt(prompt_id),
    score INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Progress(
    progress_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    Reading_Progress INT,
    Listening_Progress INT,
    Speaking_Progress INT,
    Writing_Progress INT,
    Total_Progress INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Streak(
    streak_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    streak INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Achievements(
    achievement_id SERIAL PRIMARY KEY,
    achievement VARCHAR(255) NOT NULL
);

CREATE TABLE User_Achievements(
    user_achievement_id SERIAL PRIMARY KEY,
    username VARCHAR(255) REFERENCES Users(username),
    achievement_id INT REFERENCES Achievements(achievement_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);