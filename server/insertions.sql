--* Reading *--
-- Inserting data into the passages table
-- Beginner Passages
INSERT INTO
    Passages (title, content, difficulty)
VALUES
    (
        'My First Day at School',
        'It was my first day at school. I wore a new uniform and was nervous to meet new friends. The teacher welcomed us warmly and introduced us to the classroom. I saw colorful posters on the walls and small desks arranged neatly. We sang songs and played games to get to know each other. I made a new friend named Sam. It was a happy day.',
        'Beginner'
    ),
    (
        'A Trip to the Zoo',
        'Last weekend, I went to the zoo with my family. We saw many animals, like lions, elephants, and monkeys. The lion roared loudly, and the monkeys jumped from tree to tree. We also saw a big snake coiled up and sleeping in a glass cage. I fed some birds and took many pictures. It was a wonderful experience, and I learned a lot about animals.',
        'Beginner'
    ),
    (
        'The Cat and the Mouse',
        'There was once a playful cat who loved to chase a tiny mouse around the house. Every morning, the cat would quietly hide behind the door, waiting for the mouse to come out. The mouse, however, was very clever and always found ways to escape. One day, the mouse ran up a chair, jumped onto the table, and hid inside a bowl. The cat looked everywhere but couldn''t find it.',
        'Beginner'
    ),
    (
        'My Favorite Toy',
        'My favorite toy is a red car. It has shiny wheels and makes a loud sound when I push it. I got it as a gift from my uncle on my birthday. I love racing it across the room, watching it zoom around with a small light blinking. Sometimes, I imagine that I am driving the car on a big race track, winning a prize for going the fastest.',
        'Beginner'
    ),
    (
        'The Big Tree',
        'In our backyard, we have a big, old tree that has been there for many years. Birds come every morning and sing on its branches. When the wind blows, the tree''s leaves dance and make a rustling sound. In summer, we sit under the tree for shade. Sometimes, my friends and I climb it to pick fruits. It''s like a little world of its own, full of life.',
        'Beginner'
    );

-- Intermediate Passages
INSERT INTO
    Passages (title, content, difficulty)
VALUES
    (
        'A Day at the Beach',
        'Last summer, my family and I went to the beach. The sun was shining brightly, and the waves were calm. We spread out a blanket on the sand and built sandcastles together. My brother collected seashells, and I helped him find unique ones. We even went for a swim and felt the cool water wash over us. In the evening, we watched the sunset; it was beautiful.',
        'Intermediate'
    ),
    (
        'The Farmer and His Dog',
        'A farmer lived in a small village with his loyal dog. Every morning, the farmer would wake up early and take his dog to the field. The dog would run ahead, sniffing the ground and making sure everything was safe. While the farmer harvested his crops, the dog kept an eye out for any wild animals. They were the best of friends and shared their days together.',
        'Intermediate'
    ),
    (
        'A Rainy Day',
        'Yesterday, it rained heavily all day. I watched the raindrops trickle down the window. The trees looked fresh and green, and the streets were empty. I spent the day indoors, reading my favorite book and sipping hot chocolate. In the afternoon, I saw a rainbow appear after the rain stopped. It was the perfect end to a cozy, rainy day.',
        'Intermediate'
    ),
    (
        'The Town Library',
        'Our town library is a quiet place filled with rows of books on every subject. I often go there to read stories and learn about different topics. The library also has a section for children with colorful books and puzzles. There''s a big reading room where people sit and study in peace. It''s a wonderful place to escape and explore new worlds.',
        'Intermediate'
    ),
    (
        'The Mystery Box',
        'One day, while cleaning the attic, I found an old, dusty box hidden behind some old furniture. The box looked mysterious, with strange carvings on its lid. I tried to open it, but it was locked. I wondered what could be inside—perhaps a treasure, or maybe just some old toys. I decided to keep it safe until I could find the key.',
        'Intermediate'
    );

-- Advanced Passages
INSERT INTO
    Passages (title, content, difficulty)
VALUES
    (
        'Exploring the Solar System',
        'The solar system is a vast and fascinating place, home to eight planets that revolve around the sun. Each planet has its unique characteristics, from the icy rings of Saturn to the red soil of Mars. Astronomers study these planets to understand the universe better. Recently, scientists sent a rover to Mars to explore its surface and search for signs of life. It''s amazing to think about what we might find in the future.',
        'Advanced'
    ),
    (
        'The Ecosystem and Its Balance',
        'An ecosystem is a community of living organisms interacting with their environment. Plants, animals, and microorganisms all play a role in keeping the ecosystem balanced. When one species becomes too abundant or scarce, it can disrupt the balance, affecting other species. Conservation efforts aim to protect these ecosystems and ensure they remain healthy for future generations.',
        'Advanced'
    ),
    (
        'Invention of the Telephone',
        'The invention of the telephone by Alexander Graham Bell transformed how people communicate. Before the telephone, messages had to be sent by mail, which could take days or weeks. The telephone allowed people to speak instantly, even across long distances. Over time, the technology improved, and now we can connect with others worldwide with just a smartphone.',
        'Advanced'
    ),
    (
        'The Renaissance Era',
        'The Renaissance was a period of great cultural, artistic, and scientific awakening in Europe. Artists like Leonardo da Vinci and Michelangelo created masterpieces that are still admired today. Scientists like Galileo and Copernicus questioned old beliefs and laid the groundwork for modern science. It was an era that valued knowledge and encouraged creativity.',
        'Advanced'
    ),
    (
        'The Theory of Relativity',
        'Albert Einstein''s theory of relativity changed the world of physics forever. His ideas about space and time were revolutionary and challenged the way people understood the universe. This theory explained that time and space are not fixed but can be affected by gravity. It''s a complex idea, but it has helped scientists unlock mysteries about black holes and the speed of light.',
        'Advanced'
    );

-- Inserting data into the MCQquestions table
INSERT INTO
    MCQQuestions (
        passage_id,
        question_text,
        opt1,
        opt2,
        opt3,
        opt4,
        correct_answer
    )
VALUES
    (
        'B101',
        'What did the teacher do on the first day?',
        'Greeted the children',
        'Ignored the class',
        'Left early',
        'Taught math',
        'opt1'
    ),
    (
        'B101',
        'How did the children feel on their first day?',
        'Excited',
        'Bored',
        'Angry',
        'Scared',
        'opt1'
    ),
    (
        'B101',
        'What was the teacher''s favorite subject?',
        'Math',
        'Art',
        'Science',
        'History',
        'opt2'
    ),
    (
        'B101',
        'Who was the teacher?',
        'Mr. Smith',
        'Ms. Brown',
        'Mrs. Green',
        'Mr. White',
        'opt2'
    ),
    (
        'B101',
        'What did the children eat during lunch?',
        'Sandwiches',
        'Pizza',
        'Fruit',
        'Cookies',
        'opt3'
    ),
    -- Passage B102
    (
        'B102',
        'What did the family see at the zoo?',
        'Dinosaurs',
        'Lions',
        'Unicorns',
        'Robots',
        'opt2'
    ),
    (
        'B102',
        'What animal jumped from tree to tree?',
        'Birds',
        'Squirrels',
        'Monkeys',
        'Cats',
        'opt3'
    ),
    (
        'B102',
        'Where did the family eat lunch?',
        'At home',
        'In the zoo',
        'At a restaurant',
        'In the car',
        'opt2'
    ),
    (
        'B102',
        'What did they do after the zoo?',
        'Went shopping',
        'Visited a friend',
        'Went to a park',
        'Went home',
        'opt4'
    ),
    (
        'B102',
        'What was the weather like at the zoo?',
        'Sunny',
        'Rainy',
        'Cloudy',
        'Windy',
        'opt1'
    ),
    -- Passage B103
    (
        'B103',
        'What did the cat do to catch the mouse?',
        'Chased it',
        'Fed it',
        'Ignored it',
        'Played with it',
        'opt1'
    ),
    (
        'B103',
        'Where did the cat look for the mouse?',
        'Under the couch',
        'Inside a bowl',
        'Outside',
        'In the attic',
        'opt2'
    ),
    (
        'B103',
        'What did the mouse do when it saw the cat?',
        'Ran away',
        'Squeaked',
        'Played',
        'Ignored',
        'opt1'
    ),
    (
        'B103',
        'What color was the cat?',
        'Black',
        'White',
        'Brown',
        'Gray',
        'opt1'
    ),
    (
        'B103',
        'How did the story end?',
        'The cat caught the mouse',
        'The mouse escaped',
        'They became friends',
        'The cat left',
        'opt2'
    ),
    -- Passage B104
    (
        'B104',
        'What gift did the uncle give?',
        'A bike',
        'A book',
        'A toy car',
        'A teddy bear',
        'opt3'
    ),
    (
        'B104',
        'How does the toy car make noise?',
        'By turning on',
        'By pushing',
        'By throwing',
        'By shaking',
        'opt2'
    ),
    (
        'B104',
        'What color is the toy car?',
        'Red',
        'Blue',
        'Green',
        'Yellow',
        'opt1'
    ),
    (
        'B104',
        'What did the child want for their birthday?',
        'A puppy',
        'A toy',
        'A bike',
        'A car',
        'opt2'
    ),
    (
        'B104',
        'What other toys does the child have?',
        'Only cars',
        'Action figures',
        'Dolls',
        'Puzzles',
        'opt4'
    ),
    -- Passage B105
    (
        'B105',
        'What do birds do in the big tree?',
        'Build nests',
        'Sing',
        'Fly away',
        'All of the above',
        'opt4'
    ),
    (
        'B105',
        'What do children do under the tree in summer?',
        'Climb it',
        'Sleep',
        'Hide',
        'Dig',
        'opt1'
    ),
    (
        'B105',
        'What type of tree is it?',
        'Oak',
        'Pine',
        'Maple',
        'Birch',
        'opt2'
    ),
    (
        'B105',
        'What do children bring to the tree?',
        'Toys',
        'Books',
        'Food',
        'Games',
        'opt3'
    ),
    (
        'B105',
        'What do children love to do under the tree?',
        'Play games',
        'Study',
        'Sleep',
        'Eat',
        'opt1'
    ),
    -- Intermediate Passages
    -- Passage I101
    (
        'I101',
        'What did the family spread on the sand?',
        'A blanket',
        'A towel',
        'A mat',
        'A tent',
        'opt1'
    ),
    (
        'I101',
        'What did the brother collect at the beach?',
        'Seashells',
        'Rocks',
        'Sand',
        'Water',
        'opt1'
    ),
    (
        'I101',
        'What game did they play on the beach?',
        'Frisbee',
        'Football',
        'Cricket',
        'Hide and seek',
        'opt1'
    ),
    (
        'I101',
        'What did they build at the beach?',
        'Sandcastles',
        'Houses',
        'Pools',
        'Bonfires',
        'opt1'
    ),
    (
        'I101',
        'What did they eat at the beach?',
        'Sandwiches',
        'Burgers',
        'Hotdogs',
        'Pizza',
        'opt1'
    ),
    -- Passage I102
    (
        'I102',
        'What time did the farmer wake up?',
        'Late',
        'Early',
        'In the afternoon',
        'At night',
        'opt2'
    ),
    (
        'I102',
        'What did the dog help the farmer with?',
        'Herding sheep',
        'Caring for crops',
        'Watching the house',
        'Chasing mice',
        'opt1'
    ),
    (
        'I102',
        'What kind of farm did the family have?',
        'Dairy',
        'Fruit',
        'Vegetable',
        'Mixed',
        'opt2'
    ),
    (
        'I102',
        'What was the farmer’s favorite animal?',
        'Dog',
        'Horse',
        'Cow',
        'Pig',
        'opt1'
    ),
    (
        'I102',
        'What did they grow on the farm?',
        'Corn',
        'Wheat',
        'Rice',
        'All of the above',
        'opt4'
    ),
    -- Passage I103
    (
        'I103',
        'What did the author do on a rainy day?',
        'Stayed indoors',
        'Went outside',
        'Danced',
        'Played in the rain',
        'opt1'
    ),
    (
        'I103',
        'What did the author drink?',
        'Hot chocolate',
        'Tea',
        'Coffee',
        'Lemonade',
        'opt1'
    ),
    (
        'I103',
        'What did the author do while it rained?',
        'Read books',
        'Watched TV',
        'Played games',
        'All of the above',
        'opt4'
    ),
    (
        'I103',
        'How did the author feel during the rain?',
        'Happy',
        'Sad',
        'Bored',
        'Angry',
        'opt1'
    ),
    (
        'I103',
        'What was the sound of the rain like?',
        'Calming',
        'Loud',
        'Annoying',
        'Quiet',
        'opt1'
    ),
    -- Passage I104
    (
        'I104',
        'What can you find in the town library?',
        'Computers',
        'Only books',
        'Just magazines',
        'Games',
        'opt1'
    ),
    (
        'I104',
        'What section is for children in the library?',
        'Adults',
        'Young adults',
        'Children',
        'Reference',
        'opt3'
    ),
    (
        'I104',
        'What activity can kids do in the library?',
        'Read stories',
        'Watch movies',
        'Play',
        'Sing',
        'opt1'
    ),
    (
        'I104',
        'What is the library''s opening time?',
        '9 AM',
        '8 AM',
        '10 AM',
        '7 AM',
        'opt1'
    ),
    (
        'I104',
        'What do kids need to borrow books?',
        'A library card',
        'Money',
        'ID',
        'Parental permission',
        'opt1'
    ),
    -- Passage I105
    (
        'I105',
        'What did the author find in the attic?',
        'Treasure',
        'A box',
        'A book',
        'A chair',
        'opt2'
    ),
    (
        'I105',
        'What was inside the mystery box?',
        'Old clothes',
        'Toys',
        'Books',
        'Valuables',
        'opt1'
    ),
    (
        'I105',
        'What did the author feel when opening the box?',
        'Curious',
        'Scared',
        'Excited',
        'Bored',
        'opt3'
    ),
    (
        'I105',
        'What did the author do after finding the box?',
        'Called friends',
        'Ignored it',
        'Ran away',
        'Opened it',
        'opt4'
    ),
    (
        'I105',
        'What color was the box?',
        'Brown',
        'Red',
        'Blue',
        'Green',
        'opt1'
    ),
    -- Advanced Passages
    -- Passage A101
    (
        'A101',
        'How many planets are in the solar system?',
        '6',
        '8',
        '9',
        '7',
        'opt2'
    ),
    (
        'A101',
        'What is the name of our planet?',
        'Mars',
        'Earth',
        'Venus',
        'Jupiter',
        'opt2'
    ),
    (
        'A101',
        'What is the closest planet to the sun?',
        'Venus',
        'Earth',
        'Mercury',
        'Mars',
        'opt3'
    ),
    (
        'A101',
        'Which planet is known as the red planet?',
        'Earth',
        'Mars',
        'Jupiter',
        'Venus',
        'opt2'
    ),
    (
        'A101',
        'What is the largest planet in the solar system?',
        'Earth',
        'Jupiter',
        'Saturn',
        'Neptune',
        'opt2'
    ),
    -- Passage A102
    (
        'A102',
        'What does photosynthesis help plants do?',
        'Grow',
        'Sleep',
        'Play',
        'Sing',
        'opt1'
    ),
    (
        'A102',
        'What do plants need for photosynthesis?',
        'Water',
        'Sunlight',
        'Soil',
        'All of the above',
        'opt4'
    ),
    (
        'A102',
        'Which part of the plant absorbs sunlight?',
        'Roots',
        'Leaves',
        'Stem',
        'Flowers',
        'opt2'
    ),
    (
        'A102',
        'What gas do plants take in during photosynthesis?',
        'Oxygen',
        'Nitrogen',
        'Carbon dioxide',
        'Hydrogen',
        'opt3'
    ),
    (
        'A102',
        'What do plants release during photosynthesis?',
        'Oxygen',
        'Carbon dioxide',
        'Nitrogen',
        'Methane',
        'opt1'
    ),
    -- Passage A103
    (
        'A103',
        'What is the capital of France?',
        'Berlin',
        'London',
        'Madrid',
        'Paris',
        'opt4'
    ),
    (
        'A103',
        'What is the Eiffel Tower made of?',
        'Wood',
        'Glass',
        'Steel',
        'Stone',
        'opt3'
    ),
    (
        'A103',
        'How tall is the Eiffel Tower?',
        '200m',
        '300m',
        '400m',
        '500m',
        'opt2'
    ),
    (
        'A103',
        'Who designed the Eiffel Tower?',
        'Eiffel',
        'Gustave Eiffel',
        'Louvre',
        'Da Vinci',
        'opt2'
    ),
    (
        'A103',
        'When was the Eiffel Tower completed?',
        '1889',
        '1900',
        '1850',
        '1920',
        'opt1'
    ),
    -- Passage A104
    (
        'A104',
        'What is the main ingredient in bread?',
        'Water',
        'Flour',
        'Sugar',
        'Yeast',
        'opt2'
    ),
    (
        'A104',
        'What do you need to bake bread?',
        'Oven',
        'Pan',
        'Mixer',
        'All of the above',
        'opt4'
    ),
    (
        'A104',
        'What does yeast do in bread?',
        'Adds flavor',
        'Makes it rise',
        'Preserves it',
        'Colors it',
        'opt2'
    ),
    (
        'A104',
        'What is the process of making bread called?',
        'Baking',
        'Cooking',
        'Frying',
        'Boiling',
        'opt1'
    ),
    (
        'A104',
        'How long does bread usually bake?',
        '10 minutes',
        '30 minutes',
        '60 minutes',
        '2 hours',
        'opt2'
    ),
    -- Passage A105
    (
        'A105',
        'What is a habitat?',
        'Home for plants',
        'Home for animals',
        'Place for shelter',
        'All of the above',
        'opt4'
    ),
    (
        'A105',
        'Which is an aquatic habitat?',
        'Desert',
        'Forest',
        'Ocean',
        'Mountain',
        'opt3'
    ),
    (
        'A105',
        'What do animals need to survive?',
        'Food',
        'Water',
        'Shelter',
        'All of the above',
        'opt4'
    ),
    (
        'A105',
        'Which animal lives in a forest habitat?',
        'Fish',
        'Eagle',
        'Camel',
        'Penguin',
        'opt2'
    ),
    (
        'A105',
        'What is a tundra?',
        'Hot desert',
        'Cold area',
        'Forest',
        'Mountain',
        'opt2'
    );

-- Continue with Fill-in-the-Blank Questions
INSERT INTO FillInTheBlanksQuestions (passage_id, question_text, correct_answer) 
VALUES 
    -- My First Day at School (B101)
    ('B101', 'I wore a new _______ on my first day at school.', 'uniform'),
    ('B101', 'The teacher welcomed us _______ and introduced us to the classroom.', 'warmly'),
    ('B101', 'I saw colorful _______ on the walls and small desks arranged neatly.', 'posters'),
    ('B101', 'We sang songs and played _______ to get to know each other.', 'games'),
    ('B101', 'I made a new friend named _______.', 'Sam'),

    -- A Trip to the Zoo (B102)
    ('B102', 'Last weekend, I went to the _______ with my family.', 'zoo'),
    ('B102', 'The lion _______ loudly, and the monkeys jumped from tree to tree.', 'roared'),
    ('B102', 'We saw a big _______ coiled up and sleeping in a glass cage.', 'snake'),
    ('B102', 'I fed some _______ and took many pictures.', 'birds'),
    ('B102', 'It was a wonderful experience, and I learned a lot about _______.', 'animals'),

    -- The Cat and the Mouse (B103)
    ('B103', 'The playful _______ loved to chase a tiny mouse around the house.', 'cat'),
    ('B103', 'Every morning, the cat would hide behind the _______ waiting for the mouse.', 'door'),
    ('B103', 'The mouse was very _______ and always found ways to escape.', 'clever'),
    ('B103', 'One day, the mouse ran up a chair, jumped onto the _______ and hid inside a bowl.', 'table'),
    ('B103', 'The cat looked everywhere but couldn''t _______ it.', 'find'),

    -- My Favorite Toy (B104)
    ('B104', 'My favorite toy is a _______ car.', 'red'),
    ('B104', 'It has shiny _______ and makes a loud sound when I push it.', 'wheels'),
    ('B104', 'I got it as a gift from my _______ on my birthday.', 'uncle'),
    ('B104', 'Sometimes, I imagine that I am driving the car on a big _______ track.', 'race'),
    ('B104', 'I love watching the car _______ around with a small light blinking.', 'zoom'),

    -- The Big Tree (B105)
    ('B105', 'In our backyard, we have a big, _______ tree.', 'old'),
    ('B105', 'Birds come every morning and _______ on its branches.', 'sing'),
    ('B105', 'When the wind blows, the tree''s leaves make a _______ sound.', 'rustling'),
    ('B105', 'In summer, we sit under the tree for _______.', 'shade'),
    ('B105', 'Sometimes, my friends and I _______ it to pick fruits.', 'climb');

