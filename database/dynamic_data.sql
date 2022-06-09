USE smartu;

DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS announcement;
DROP TABLE IF EXISTS question_category;
DROP TABLE IF EXISTS quiz_question;
DROP TABLE IF EXISTS quiz_answer;

CREATE TABLE `activities` (
  `activityid` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `activityname` varchar(64) NOT NULL,
  `activitystatus` int(1) NOT NULL,
  `activitydescription` text NOT NULL,
  `activitycreator` int(11) NOT NULL,
  `levellow` int(3) NOT NULL,
  `levelhigh` int(3) NOT NULL,
  `adaptive_instruction` text NOT NULL,
  `fixed_instruction` text NOT NULL,
  `phasetwobegindate` date NOT NULL,
  `phasetwoenddate` date NOT NULL,
  `startdate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `enddate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `archived` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `quiz_answer` (
    `answerid` int(11) NOT NULL,
    `questionid` int(11) DEFAULT NULL,
    `answer` text DEFAULT NULL,
    `correctanswer` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `quiz_question` (
  `questionid` int(11) NOT NULL,
  `questinact` int(11) NOT NULL,
  `questiontype` int(11) NOT NULL,
  `questioncategory` int(11) NOT NULL,
  `questiondifficulty` int(1) NOT NULL,
  `questiontheme` text NOT NULL,
  `questionavailable` int(1) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `fixed` int(11) NOT NULL,
  `activityid` int(11) NOT NULL,
  `inallactivities` int(1) NOT NULL,
  `probzA` double NOT NULL,
  `probzB` double NOT NULL,
  `probzC` double NOT NULL,
  `diff` int(11) NOT NULL,
  `monades` float NOT NULL,
  `RTE_threshold` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `announcement` (
    `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `title` varchar(72) NOT NULL,
    `content` text NOT NULL,
    `date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `question_category` (
  `categoryid` int(11) NOT NULL,
  `categoryname` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

ALTER TABLE `quiz_answer`
    ADD PRIMARY KEY (`answerid`);

ALTER TABLE `quiz_question`
    ADD PRIMARY KEY (`questionid`),
    ADD UNIQUE KEY `questionid` (`questionid`);

ALTER TABLE `quiz_answer`
    MODIFY `answerid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=429;

ALTER TABLE `quiz_question`
    MODIFY `questionid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

INSERT INTO `activities` (`activityid`, `activityname`, `activitystatus`, `activitydescription`, `activitycreator`, `levellow`, `levelhigh`, `adaptive_instruction`, `fixed_instruction`, `phasetwobegindate`, `phasetwoenddate`, `startdate`, `enddate`, `archived`) VALUES
(1, 'Coding', 2, 'This activity will let you test yourself on questions in Python, Algorithms, Binary and some general programming questions.', 1, 0, 0, 'This self-assessment quiz is <strong> adaptive</strong>: it includes those questions that are more appropriate for you to answer. All questions are in multiple choice format, and have 2 to 4 possible answers. The questions are displayed seperately, one-by-one. You have to answer <strong>all questions</strong> by selecting <strong>ONLY ONE ANSWER</strong> each time. Please, be careful when answering the questions because you will <strong>NOT<strong> have the option to (a) skip a question, (b) revise and change your answer,and (c) to review your answers on the quiz-questions before finalizing the quiz. ', '', '2018-10-23', '2018-10-26', '2022-03-29 09:02:51', '2023-01-01 00:00:00', 0),
(2, 'Networks', 2, 'The activity will give you the opportunity to test your knowledge on the content of IT2805, based on the lectures given so far, with the use of high technology and a simple adaptive self-assessment environment. After granting consent, you will wear a wristband and an EEG cap and be connected to all the data collection devices (i.e., eye-tracker, wristband, EEG, cameras). Then, you will have to answer to <strong>approx. 20 multiple choice questions</strong> and to tell us your opinion about this experience, to help us further improve it. The whole process will take <strong>approx. 45 minutes</strong>.', 1, 0, 0, 'This self-assessment quiz is <strong> adaptive</strong>: it includes those questions that are more appropriate for you to answer. All questions are in multiple choice format, and have 2 to 4 possible answers. The questions are displayed seperately, one-by-one. You have to answer <strong>all questions</strong> by selecting <strong>ONLY ONE ANSWER</strong> each time. Please, be careful when answering the questions because you will <strong>NOT<strong> have the option to (a) skip a question, (b) revise and change your answer,and (c) to review your answers on the quiz-questions before finalizing the quiz. ', '', '2021-08-20', '2021-12-14', '2022-03-29 09:02:19', '2023-01-01 00:00:00', 0);

INSERT INTO `announcement` (`id`, `title`, `content`, `date`) VALUES
(1, 'Welcome to SmartU', 'SmartU is an adaptive assessment system involving students in their own process of learning.', '2022-01-08'),
(2, 'Good monday!', 'Hope you had an amazing weekend! This week, we will introduce the ITGK activity in SmartU, giving you the opportunity to practise towards the exam.', '2022-01-15');

INSERT INTO `question_category` (`categoryid`, `categoryname`) VALUES
(1, 'No category'),
(2, 'Algorithms'),
(3, 'General programming'),
(4, 'Python'),
(6, 'Binary, bits & bytes');

INSERT INTO `quiz_question` (`questionid`, `questinact`, `questiontype`, `questioncategory`, `questiondifficulty`, `questiontheme`, `questionavailable`, `image`, `fixed`, `activityid`, `inallactivities`, `probzA`, `probzB`, `probzC`, `diff`, `monades`, `RTE_threshold`) VALUES
(1, 1, 1, 2, 3, 'Algoritmer er alltid organisert slik at man først gjør et steg, så neste steg, så neste steg...', 1, 'IMG_7116.PNG', 1, 1, 1, 0.249, 0.133, 0.094, 3, 0, 7.09),
(2, 2, 1, 3, 1, 'Bestem True eller False: (A>5 or B==2)', 1, 'q5.png', 1, 1, 1, 0.78, 0.618, 0.42, 1, 0, 4.16),
(4, 4, 1, 3, 2, 'Bestem True eller False: (A>B or B>C or C>D or D>A)', 1, 'q5.png', 1, 1, 1, 0.78, 0.62, 0.306, 2, 0, 5.6),
(5, 5, 1, 3, 2, 'Bestem True eller False: (B<=C)', 1, 'q5.png', 1, 1, 1, 0.78, 0.564, 0.243, 2, 0, 4.69),
(6, 6, 1, 3, 3, 'Data som blir matet en funksjon når den blir kalt kalles...', 1, NULL, 1, 1, 1, 0.577, 0.342, 0.125, 3, 0, 4.81),
(7, 7, 1, 2, 3, 'Definisjon av algoritme er i følge teoriboka et ordnet sett av ...', 1, NULL, 1, 1, 1, 0.535, 0.329, 0.265, 3, 0, 10.08),
(8, 8, 1, 2, 1, 'En algoritme kan beskrives som', 1, NULL, 1, 1, 1, 0.724, 0.605, 0.338, 1, 0, 7.51),
(9, 9, 1, 6, 1, 'En byte inneholder hvor mange bit?', 1, NULL, 1, 1, 1, 0.78, 0.68, 0.645, 1, 0, 3.78),
(11, 11, 1, 3, 1, 'En funksjon består av...', 1, NULL, 1, 1, 1, 0.762, 0.737, 0.572, 1, 0, 4.75),
(12, 12, 1, 4, 1, 'Er det lov å returnere flere verdier fra en funksjon i Python?', 1, NULL, 1, 1, 1, 0.749, 0.655, 0.306, 1, 0, 4.21),
(13, 13, 1, 4, 3, 'Får man kjørt denne koden?', 1, 'q13.png', 1, 1, 1, 0.619, 0.334, 0.131, 3, 0, 4.18),
(14, 14, 1, 4, 3, 'For å flytte filpekeren i fila brukes:', 1, NULL, 1, 1, 1, 0.359, 0.121, 0.049, 3, 0, 6.56),
(15, 15, 1, 4, 3, 'For å generere et tilfeldig flyttall mellom 0 og 0.999999999 benyttes funksjonen _____', 1, NULL, 1, 1, 1, 0.662, 0.299, 0.096, 3, 0, 6.13),
(16, 16, 1, 4, 3, 'For å returnere hele innholdet av fila som ei liste brukes:', 1, NULL, 1, 1, 1, 0.628, 0.323, 0.113, 3, 0, 7.07),
(17, 17, 1, 3, 2, 'For å utføre en kode et bestemt antall ganger, bør man bruke...', 1, NULL, 1, 1, 1, 0.717, 0.431, 0.195, 2, 0, 6.83),
(18, 18, 1, 4, 2, 'For å lese inn en highscore liste fra et dataspill fra en fil, er det lurt å bruke:', 1, NULL, 1, 1, 1, 0.675, 0.448, 0.214, 2, 0, 7.31),
(19, 19, 1, 3, 1, 'Før en datamaskin skal kjøre et program, må programmet oversetters til...', 1, NULL, 1, 1, 1, 0.753, 0.524, 0.336, 1, 0, 7.34),
(20, 20, 1, 4, 1, 'Før man kan bruke et standardbibliotek må man skrive uttrykket _____', 1, NULL, 1, 1, 1, 0.776, 0.74, 0.483, 1, 0, 5.72),
(21, 21, 1, 2, 2, 'Hva beskriver store-theta (Θ) notasjon i forbindelse med algoritmer?', 1, NULL, 1, 1, 1, 0.722, 0.601, 0.358, 2, 0, 10.68),
(22, 22, 1, 3, 1, 'Hva betyr det å programmere?', 1, NULL, 1, 1, 1, 0.757, 0.498, 0.384, 1, 0, 8.25),
(23, 23, 1, 2, 1, 'Hva betyr det at en algoritme skal ha en terminerende prosess?', 1, NULL, 1, 1, 1, 0.698, 0.619, 0.394, 1, 0, 10.2),
(24, 24, 1, 6, 3, 'Hva blir det binære tallet 10101010 desimalt?', 1, NULL, 1, 1, 1, 0.784, 0.39, 0.26, 3, 0, 5.06),
(25, 25, 1, 4, 3, 'Hva blir resultatet av A.difference(B) for mengdene vist på bilde?', 1, 'q25.png', 1, 1, 1, 0.711, 0.53, 0.167, 3, 0, 7.37),
(26, 26, 1, 4, 2, 'Hva blir resultatet av A.issubset(B) for mengene på bildet?', 1, 'q25.png', 1, 1, 1, 0.782, 0.638, 0.475, 2, 0, 7.95),
(27, 27, 1, 6, 1, 'Hva blir resultatet av binæraddisjon av 10101 + 10101?', 1, NULL, 1, 1, 1, 0.78, 0.68, 0.496, 1, 0, 6.11),
(28, 28, 1, 6, 3, 'Hva blir resultatet av binærsubtraksjon av 11101 - 1011?', 1, NULL, 1, 1, 1, 0.79, 0.52, 0.213, 3, 0, 6.1),
(29, 29, 1, 4, 3, 'Hva blir skrevet ut når dette programmet blir kjørt?', 1, 'q29.png', 1, 1, 1, 0.474, 0.128, 0.041, 3, 0, 6.77),
(30, 30, 1, 4, 3, 'Hva blir skrevet ut til skjerm her?', 1, 'q30.png', 1, 1, 1, 0.625, 0.323, 0.083, 3, 0, 6.49),
(31, 31, 1, 4, 3, 'Hva blir skrevet ut til skjerm her?', 1, 'q31.png', 1, 1, 1, 0.779, 0.371, 0.116, 3, 0, 6.46),
(32, 32, 1, 4, 2, 'Hva blir skrevet ut til skjerm her?', 1, 'q32.png', 1, 1, 1, 0.778, 0.574, 0.22, 2, 0, 6.66),
(33, 33, 1, 4, 2, 'Hva blir skrevet ut til skjerm her?', 1, 'q33.png', 1, 1, 1, 0.745, 0.646, 0.375, 2, 0, 5.41),
(34, 34, 1, 4, 3, 'Hva blir skrevet ut til skjerm med koden  for i in A: print(i)  med A definert som på bildet?', 1, 'q34.png', 1, 1, 1, 0.619, 0.388, 0.152, 3, 0, 8.15),
(35, 35, 1, 4, 3, 'Hva blir skrevet ut til skjerm med print(text[::3]) ?', 1, 'q37.png', 1, 1, 1, 0.546, 0.243, 0.099, 3, 0, 7.44),
(36, 36, 1, 4, 1, 'Hva blir skrevet ut til skjerm med print(text[-3:]) ?', 1, 'q37.png', 1, 1, 1, 0.744, 0.626, 0.269, 1, 0, 7.36),
(37, 37, 1, 4, 2, 'Hva blir skrevet ut til skjerm med print(text[4]) ?', 1, 'q37.png', 1, 1, 1, 0.723, 0.524, 0.319, 2, 0, 7.12),
(38, 38, 1, 4, 2, 'Hva blir skrevet ut til skjerm når man kjører dette programmet?', 1, 'q38.png', 1, 1, 1, 0.706, 0.483, 0.146, 2, 0, 7.71),
(39, 39, 1, 6, 3, 'Hva blir tallet -1 som 2-kompliment hvis 1 binært er 001?', 1, NULL, 1, 1, 1, 0.78, 0.39, 0.213, 3, 0, 7.03),
(40, 40, 1, 4, 2, 'Hva blir verdien til x når man kjører: for x in text: ?', 1, 'q37.png', 1, 1, 1, 0.728, 0.553, 0.176, 2, 0, 8.6),
(41, 41, 1, 3, 1, 'Hva brukes til å lagre og referere til verdier i et program?', 1, NULL, 1, 1, 1, 0.719, 0.348, 0.105, 1, 0, 7.04),
(42, 42, 1, 4, 2, 'Hva er den største forskjellen mellom lister og dictionaries?', 1, NULL, 1, 1, 1, 0.711, 0.634, 0.381, 2, 0, 8.94),
(43, 43, 1, 3, 2, 'Hva er det som holder orden på hvor langt man er kommet i fila?', 1, NULL, 1, 1, 1, 0.659, 0.467, 0.211, 2, 0, 7.4),
(44, 44, 1, 6, 3, 'Hva er det største tallet som kan representeres med 64-bits signed integer som 2er kompliment?', 1, NULL, 1, 1, 1, 0.395, 0.102, 0.007, 3, 0, 6.17),
(45, 45, 1, 3, 1, 'Hva er et program?', 1, NULL, 1, 1, 1, 0.698, 0.269, 0.188, 1, 0, 7.72),
(46, 46, 1, 4, 1, 'Hva er hensikten med moduler i Python?', 1, NULL, 1, 1, 1, 0.756, 0.661, 0.376, 1, 0, 7.32),
(47, 47, 1, 3, 2, 'Hva er pseudokode?', 1, NULL, 1, 1, 1, 0.67, 0.308, 0.098, 2, 0, 6.08),
(48, 48, 1, 3, 2, 'Hva er rekursjon?', 1, NULL, 1, 1, 1, 0.657, 0.522, 0.221, 2, 0, 8.61),
(49, 49, 1, 6, 3, 'Hva er representasjon i binærsystemet av det desimale tallet 1234?', 1, NULL, 1, 1, 1, 0.585, 0.39, 0.071, 3, 0, 7.47),
(51, 51, 1, 4, 1, 'Hva er sant om datastrukturen mengde (set)?', 1, NULL, 1, 1, 1, 0.773, 0.538, 0.414, 1, 0, 8.37),
(52, 52, 1, 6, 3, 'Hva er tallverdien i desimalsystemet av det heksadesimale tallet 23F?', 1, NULL, 1, 1, 1, 0.585, 0.39, 0.177, 3, 0, 6.14),
(53, 53, 1, 2, 2, 'Hva er tidskompleksiteten til denne pseudokoden?', 1, 'q53.jpg', 1, 1, 1, 0.708, 0.552, 0.193, 2, 0, 6.56),
(54, 54, 1, 2, 2, 'Hva er tidskompleksiteten til denne pseudokoden?', 1, 'q54.png', 1, 1, 1, 0.661, 0.442, 0.161, 2, 0, 5.92),
(55, 55, 1, 2, 1, 'Hva gjør denne algoritmen?', 1, 'q55.png', 1, 1, 1, 0.67, 0.41, 0.154, 1, 0, 6.81),
(56, 56, 1, 4, 3, 'Hva gjør koden som er vist på bildet?', 1, 'q56.png', 1, 1, 1, 0.596, 0.338, 0.124, 3, 0, 9.55),
(57, 57, 1, 4, 2, 'Hva gjør koden: for x in presidents: print(x)', 1, 'q112.png', 1, 1, 1, 0.733, 0.571, 0.279, 2, 0, 7.69),
(58, 58, 1, 3, 1, 'Hva gjør man etter å ha skrevet kode i programutviklingssyklusen?', 1, NULL, 1, 1, 1, 0.76, 0.646, 0.393, 1, 0, 7.16),
(59, 59, 1, 4, 2, 'Hva gjør pickle-biblioteket i Python?', 1, NULL, 1, 1, 1, 0.785, 0.573, 0.332, 2, 0, 9.02),
(60, 60, 1, 2, 1, 'Hva kan du si om denne algoritmen?', 1, 'q60.png', 1, 1, 1, 0.772, 0.439, 0.18, 1, 0, 7.4),
(61, 61, 1, 3, 2, 'Hva ligger i begrepet \"P and A coding\"?', 1, NULL, 1, 1, 1, 0.791, 0.688, 0.461, 2, 0, 6.72),
(62, 62, 1, 3, 1, 'Hva ligger i begrepet nøstede løkker?', 1, NULL, 1, 1, 1, 0.753, 0.577, 0.296, 1, 0, 7.03),
(63, 63, 1, 3, 1, 'Hva ligger i begrepet tilordning?', 1, NULL, 1, 1, 1, 0.714, 0.388, 0.209, 1, 0, 7.06),
(64, 64, 1, 4, 1, 'Hva må man skrive for at en funksjon skal gi tilbake en verdi?', 1, NULL, 1, 1, 1, 0.783, 0.563, 0.474, 1, 0, 6.08),
(65, 65, 1, 4, 3, 'Hva må skrives i Python for å hente ut \'Bill\',\'Ronald\', og \'Jimmy\' fra lista presidents?', 1, 'q112.png', 1, 1, 1, 0.555, 0.281, 0.075, 3, 0, 7.95),
(66, 66, 1, 4, 2, 'Hva må skrives i Python for å hente ut \'George\', \'Ronald\', og \'Gerald\' fra lista presidents?', 1, 'q112.png', 1, 1, 1, 0.711, 0.485, 0.132, 2, 0, 7.34),
(67, 67, 1, 4, 3, 'Hva må skrives i Python for å sette inn \'George\' mellom \'Bill\' og \'Ronald\' i lista presidents?', 1, 'q112.png', 1, 1, 1, 0.443, 0.158, 0.035, 3, 0, 8.03),
(68, 68, 1, 4, 2, 'Hva skriver man i Python for å få verdien π?', 1, NULL, 1, 1, 1, 0.741, 0.585, 0.319, 2, 0, 5.02),
(69, 69, 1, 4, 3, 'Hva skrives ut til skjermen med følgende kode for mengden A vist på bilde: print(A[2:4]) ?', 1, 'q69.png', 1, 1, 1, 0.596, 0.28, 0.098, 3, 0, 7.19),
(70, 70, 1, 2, 1, 'Hva stemmer for den naive bondesjakkalgoritmen hvis størrelsen på brettet er n x n?', 1, 'q70.png', 1, 1, 1, 0.746, 0.602, 0.509, 1, 0, 8.89),
(71, 71, 1, 2, 2, 'Hva stemmer for den smarte bondesjakkalgoritmen for et brett med n x n ruter?', 1, 'q71.png', 1, 1, 1, 0.671, 0.538, 0.253, 2, 0, 8.62),
(72, 72, 1, 2, 3, 'Hva tidskompleksiteten til en algoritme der man hele tiden halverer elementer man behandler?', 1, NULL, 1, 1, 1, 0.324, 0.189, 0.036, 3, 0, 6.66),
(73, 73, 1, 2, 2, 'Hva tidskompleksiteten til program med enkel løkke som går igjennom alle elementene?', 1, NULL, 1, 1, 1, 0.743, 0.635, 0.273, 2, 0, 5.77),
(74, 74, 1, 2, 3, 'Hva tidskompleksiteten til rent sekvensielt program uten noen repeterende handlinger?', 1, NULL, 1, 1, 1, 0.475, 0.29, 0.109, 3, 0, 5.62),
(75, 75, 1, 4, 1, 'Hvem av disse er muterbar?', 1, NULL, 1, 1, 1, 0.732, 0.511, 0.306, 1, 0, 4.1),
(76, 76, 1, 4, 1, 'Hvilke datatyper kan en liste inneholde?', 1, NULL, 1, 1, 1, 0.769, 0.725, 0.558, 1, 0, 6.12),
(77, 77, 1, 2, 1, 'Hvilke egenskaper har binærsøk algoritmen?', 1, 'q55.png', 1, 1, 1, 0.741, 0.497, 0.223, 1, 0, 6.12),
(78, 78, 1, 2, 1, 'Hvilke egenskaper har innstikksorteringsalgoritmen?', 1, 'q78.png', 1, 1, 1, 0.662, 0.283, 0.153, 1, 0, 7.27),
(79, 79, 1, 2, 2, 'Hvilke egenskaper har sekvelsielt søk?', 1, 'q82.png', 1, 1, 1, 0.644, 0.263, 0.098, 2, 0, 6.43),
(80, 80, 1, 3, 1, 'Hvilke fordeler gir bruk av funksjoner?', 1, NULL, 1, 1, 1, 0.772, 0.537, 0.452, 1, 0, 6.45),
(81, 81, 1, 4, 3, 'Hvilke(t) tall blir vist på skjermen når følgende kode blir kjørt?', 1, 'q81.png', 1, 1, 1, 0.328, 0.1, 0.87, 3, 0, 7.23),
(82, 82, 1, 2, 1, 'Hvilken algoritme er dette?', 1, 'q82.png', 1, 1, 1, 0.72, 0.439, 0.111, 1, 0, 5.81),
(83, 83, 1, 2, 3, 'Hvilken algoritme med følgende karakteristikker vil være mest effektiv med mange elementer?', 1, 'q83.png', 1, 1, 1, 0.552, 0.212, 0.068, 3, 0, 7.72),
(84, 84, 1, 2, 2, 'Hvilken algoritme med følgende karakteristikker vil være minst effektiv med mange elementer?', 1, 'q84.png', 1, 1, 1, 0.753, 0.603, 0.22, 2, 0, 6.52),
(85, 85, 1, 2, 2, 'Hvilken av disse algoritmene er mest effektiv for å sjekke vinner i bondesjakk (fem på rad)?', 1, 'q85.png', 1, 1, 1, 0.712, 0.511, 0.269, 2, 0, 6.42),
(86, 86, 1, 4, 1, 'Hvilken datatype anbefales en variabel for å lagre millimeter nedbør?', 1, NULL, 1, 1, 1, 0.777, 0.538, 0.28, 1, 0, 5.03),
(87, 87, 1, 4, 1, 'Hvilken datatype anbefales en variabel for å lagre navn på et fag?', 1, NULL, 1, 1, 1, 0.81, 0.7, 0.289, 1, 0, 5.02),
(88, 88, 1, 4, 1, 'Hvilken datatype anbefales en variabel for å lagre om en deltaker er påmeldt eller ikke?', 1, NULL, 1, 1, 1, 0.778, 0.692, 0.351, 1, 0, 5.04),
(89, 89, 1, 4, 3, 'Hvilken datatype anbefales en variabel for å lagre personnummer?', 1, NULL, 1, 1, 1, 0.249, 0.087, 0.026, 3, 0, 5.01),
(90, 90, 1, 4, 1, 'Hvilken datatype anbefales en variabel for å lagre pris på bensin?', 1, NULL, 1, 1, 1, 0.77, 0.511, 0.169, 1, 0, 5.02),
(91, 91, 1, 4, 1, 'Hvilken datatype anbefales en variabel for å lagre tekstmelding?', 1, NULL, 1, 1, 1, 0.775, 0.607, 0.217, 1, 0, 5.03),
(92, 92, 1, 4, 1, 'Hvilken datatype brukes til heltall?', 1, NULL, 1, 1, 1, 0.762, 0.651, 0.208, 1, 0, 5.01),
(93, 93, 1, 4, 1, 'Hvilken datatype har en variabel for å lagre telefonnummer (uten landskode)?', 1, NULL, 1, 1, 1, 0.774, 0.588, 0.298, 1, 0, 5.04),
(94, 94, 1, 4, 1, 'Hvilken funksjon brukes for å omforme et tall til en streng?', 1, NULL, 1, 1, 1, 0.771, 0.637, 0.452, 1, 0, 5.19),
(95, 95, 1, 4, 3, 'Hvilken metode brukes for å sjekke om en streng kun består av tall?', 1, NULL, 1, 1, 1, 0.577, 0.43, 0.141, 3, 0, 5.02),
(96, 96, 1, 4, 1, 'Hvilken operator brukes til å sette sammen flere strenger?', 1, NULL, 1, 1, 1, 0.755, 0.571, 0.387, 1, 0, 3.06),
(97, 97, 1, 4, 3, 'Hvilken tilgangstype brukes for å logging (skrive ekstra data på slutten av fila)?', 1, NULL, 1, 1, 1, 0.589, 0.248, 0.042, 3, 0, 3.77),
(98, 98, 1, 4, 1, 'Hvilken metode brukes til å lage en liste av alle ordene i streng?', 1, NULL, 1, 1, 1, 0.734, 0.633, 0.39, 1, 0, 5.01),
(99, 99, 1, 6, 2, 'Hvis \'Hallo\' i ASCII representeres som 48 61 6c 6c 6f heksadesimalt, hva blir da \'Morna\'?', 1, NULL, 1, 1, 1, 0.585, 0.38, 0.261, 2, 0, 6.8),
(100, 100, 1, 3, 1, 'Hvis man repetere kode så lenge en betingelse er oppfylt bruker man...', 1, NULL, 1, 1, 1, 0.735, 0.591, 0.362, 1, 0, 6.28),
(101, 101, 1, 3, 1, 'Hvis man skal ha kode som kan repeteres helt til en betingelse blir oppfylt bruker man...', 1, NULL, 1, 1, 1, 0.75, 0.56, 0.228, 1, 0, 6.58),
(102, 102, 1, 3, 1, 'Hvis man skal iterere over (gå igjennom) alle elementene i ei liste benytter man...', 1, NULL, 1, 1, 1, 0.764, 0.467, 0.297, 1, 0, 6.25),
(103, 103, 1, 3, 1, 'Hvis man skal iterere over alle elementene i ei liste benytter man...', 1, NULL, 1, 1, 1, 0.768, 0.627, 0.375, 1, 0, 5.86),
(105, 105, 1, 6, 3, 'Hvor mange bit trenger man for å representere 1750 ulike tilstander?', 1, NULL, 1, 1, 1, 0.583, 0.13, 0.101, 3, 0, 6.37),
(106, 106, 1, 6, 2, 'Hvor mange kombinasjoner får man med 4 bit?', 1, NULL, 1, 1, 1, 0.662, 0.618, 0.39, 2, 0, 4.53),
(107, 107, 1, 2, 2, 'Hvordan beskrives ofte algoritmer?', 1, NULL, 1, 1, 1, 0.748, 0.458, 0.269, 2, 0, 5.01),
(108, 108, 1, 3, 1, 'Hvordan blir data lagret til fil?', 1, NULL, 1, 1, 1, 0.721, 0.676, 0.482, 1, 0, 6.14),
(109, 109, 1, 4, 1, 'Hvordan erstattes \'Jimmy\' med \'Donald\' i lista presidents?', 1, 'q112.png', 1, 1, 1, 0.782, 0.682, 0.315, 1, 0, 6.1),
(110, 110, 1, 4, 1, 'Hvordan erstattes \'Jimmy\' med \'Jens\' i lista presidents?', 1, 'q112.png', 1, 1, 1, 0.777, 0.673, 0.339, 1, 0, 5.89),
(112, 112, 1, 4, 2, 'Hvordan kan du hente ut \'Ronald\' fra tabellen presidents?', 1, 'q112.png', 1, 1, 1, 0.731, 0.589, 0.348, 2, 0, 5.91),
(113, 113, 1, 6, 3, 'Hvordan representeres tallet -3 binært med fortegnsbit, hvis tallet 3 representeres 011?', 1, NULL, 1, 1, 1, 0.59, 0.52, 0.284, 3, 0, 5.53),
(114, 114, 1, 4, 1, 'Hvordan utføres filoperasjoner i Python?', 1, NULL, 1, 1, 1, 0.771, 0.672, 0.543, 1, 0, 5.62),
(115, 115, 1, 2, 1, 'Må stegene i en algoritme være ordnet (følge en struktur)?', 1, NULL, 1, 1, 1, 0.703, 0.628, 0.467, 1, 0, 4.16),
(116, 116, 1, 2, 1, 'Med at en algoritme skal ha entydige steg menes...', 1, NULL, 1, 1, 1, 0.715, 0.61, 0.41, 1, 0, 7.56),
(117, 117, 1, 4, 2, 'Påstand: En tekststreng kan endre deler av sitt innhold (mutable).', 1, NULL, 1, 1, 1, 0.645, 0.319, 0.207, 2, 0, 5.38),
(118, 118, 1, 4, 1, 'Påstand: Man kan bruke operatoren in for å avgjøre om en streng inneholder en annen streng', 1, NULL, 1, 1, 1, 0.79, 0.649, 0.264, 1, 0, 5.42),
(119, 119, 1, 3, 1, 'Programmer blir utført...', 1, NULL, 1, 1, 1, 0.76, 0.524, 0.192, 1, 0, 5.13),
(120, 120, 1, 3, 1, 'Programmet som oversetter programmeringsspråk til maskinkode kalles...', 1, NULL, 1, 1, 1, 0.789, 0.524, 0.096, 1, 0, 5.02),
(121, 121, 1, 4, 1, 'Uttrykk for exception er:', 1, NULL, 1, 1, 1, 0.763, 0.673, 0.333, 1, 0, 6.18),
(122, 122, 1, 3, 2, 'Hvis x=4, y=3 og z=8, hva blir uttrykket (x+y&gt;z or z+y&lt;x) evaluert til?', 1, NULL, 1, 1, 1, 0.549, 0.214, 0.166, 2, 0, 5.13),
(123, 1, 1, 6, 1, 'Radix-verdien i det binære tallsystemet er ...', 1, NULL, 1, 1, 1, 0, 0, 0, 1, 0, 0),
(124, 1, 1, 6, 1, 'Den binære ekvivalenten til desimaltallet 10 er...', 1, NULL, 1, 1, 1, 0, 0, 0, 1, 0, 0),
(125, 1, 1, 6, 1, 'Et programmeringsspråk skrevet i bare binærkode er ...', 1, NULL, 1, 1, 1, 0, 0, 0, 1, 0, 0),
(126, 1, 1, 6, 2, 'Den hexadesimale representasjonen av 1110 er ...', 1, NULL, 1, 1, 1, 0, 0, 0, 1, 0, 0),
(127, 1, 1, 6, 1, 'Hvilket av de følgende alternativene er ikke et binærtall?', 1, NULL, 1, 1, 1, 0, 0, 0, 1, 0, 0);

INSERT INTO `quiz_answer` (`answerid`, `questionid`, `answer`, `correctanswer`) VALUES
(1, 1, 'Nei', 1),
(2, 1, 'Ja', 0),
(3, 2, 'False', 1),
(4, 2, 'True', 0),
(7, 4, 'True', 1),
(8, 4, 'False', 0),
(9, 5, 'True', 1),
(10, 5, 'False', 0),
(11, 6, 'Argument', 1),
(12, 6, 'Parameter', 0),
(13, 6, 'Variabel', 0),
(14, 6, 'Funksjon', 0),
(15, 7, 'entydige, utførbare steg som def en terminerende prosess', 1),
(16, 7, 'tvetydige steg som løser et gitt problem effektivt', 0),
(17, 7, 'alger som spiller slagverk eller andre rytmeinstrumenter', 0),
(18, 7, 'sekvenser som utføres enten i parallell eller sekvensielt', 0),
(19, 8, 'Ordet sett eller Entydige, utførbare skritt eller Definerer en terminerende prosess', 1),
(20, 8, 'terminerende regler som er rekursive', 0),
(21, 9, '8', 1),
(22, 9, '16', 0),
(23, 9, '1', 0),
(24, 9, '32', 0),
(27, 11, 'Hode eller Kodeblokk', 1),
(28, 11, 'Hale', 0),
(29, 11, 'Fundament', 0),
(30, 12, 'Ja', 1),
(31, 12, 'Nei', 0),
(32, 13, 'Nei', 1),
(33, 13, 'Ja', 0),
(34, 14, 'f.seek(offset, fra_hvor)', 1),
(35, 14, 'f.move(index)', 0),
(36, 14, 'f.tell(index)', 0),
(37, 14, 'f.setIndex(index)', 0),
(38, 15, 'random', 1),
(39, 15, 'randint', 0),
(40, 15, 'randrange', 0),
(41, 15, 'uniform', 0),
(42, 16, 'f.readlines()', 1),
(43, 16, 'f.read()', 0),
(44, 16, 'f.readline()', 0),
(45, 16, 'f.read(n)', 0),
(46, 17, 'for-løkke og range', 1),
(47, 17, 'while-løkke', 0),
(48, 17, 'for-løkke og liste', 0),
(49, 17, 'if-elsif og else', 0),
(50, 18, 'highscores=f.readlines()', 1),
(51, 18, 'highscores=f.read()', 0),
(52, 18, 'highscores=f.read(10)', 0),
(53, 18, 'highscores=f.readline()', 0),
(54, 19, 'Maskinkode', 1),
(55, 19, 'Python', 0),
(56, 19, 'Matlab', 0),
(57, 19, 'Java', 0),
(58, 20, 'import', 1),
(59, 20, 'load', 0),
(60, 20, 'library', 0),
(61, 20, 'systemlibrary', 0),
(62, 21, 'Omtrentlig tidsforbruket for algoritme for n elementer eller Omtrentlig antall runder kode med n elementer må kjøre', 1),
(63, 21, 'Konkret hvor lang tid en algoritmer tar målt i sekunder', 0),
(64, 21, 'Beskriver IQ til den som har laget algoritmen (thet-i-nøtta)', 0),
(65, 22, 'Fortelle datamaskin hva den skal utføre', 1),
(66, 22, 'Kjøre et program', 0),
(67, 22, 'Bestemme når et program skal kjøres', 0),
(68, 22, 'Installere et program', 0),
(69, 23, 'Utførelse av algoritmen skal lede til en slutt', 1),
(70, 23, 'Algoritmen blir i framtiden utslettet av cyborgs', 0),
(71, 23, 'Algoritmen termineres når de fleste stegene er utført', 0),
(72, 23, 'Algoritmen avsluttes (termineres) når brukeren gir beskjed', 0),
(73, 24, '170', 1),
(74, 24, '190', 0),
(75, 24, '180', 0),
(76, 24, '200', 0),
(77, 25, '{1,2,3}', 1),
(78, 25, '{7,8,9}', 0),
(79, 25, '{1,2,3,7,8,9}', 0),
(80, 25, '{}', 0),
(81, 26, 'False', 1),
(82, 26, 'True', 0),
(83, 26, '{1,2,3}', 0),
(84, 26, '{1,2,3,7,8,9}', 0),
(85, 27, '101010', 1),
(86, 27, '110001', 0),
(87, 27, '101000', 0),
(88, 27, '100000', 0),
(89, 28, '10010', 1),
(90, 28, '1111', 0),
(91, 28, '10110', 0),
(92, 28, '1010', 0),
(93, 29, 'Tallet 0 eller 1', 1),
(94, 29, 'Ingen ting', 0),
(95, 29, 'Tallet  0,1 eller 3', 0),
(96, 29, 'Tallet 1 eller 3', 0),
(97, 30, '10', 1),
(98, 30, '0', 0),
(99, 30, '5', 0),
(100, 30, '20', 0),
(101, 31, 'False', 1),
(102, 31, 'True', 0),
(103, 31, '5', 0),
(104, 31, 'Ingen ting', 0),
(105, 32, '\'Liten\'', 1),
(106, 32, '\'Medium\'', 0),
(107, 32, 'Gigantisk', 0),
(108, 32, '\'Liten\' og \'Medium\'', 0),
(109, 33, '\'ost\'', 1),
(110, 33, 'Ingen ting', 0),
(111, 33, '5, \'nese\', \'ost\'', 0),
(112, 33, '\'nese\', \'ost\'', 0),
(113, 34, 'Alle tallene', 1),
(114, 34, 'Alle tekststtrengene', 0),
(115, 34, 'Alle tall og tekststrenger', 0),
(116, 34, 'Ingen ting', 0),
(117, 35, '\"TBON\"', 1),
(118, 35, '\"BON\"', 0),
(119, 35, '\"TO \"', 0),
(120, 35, '\"NOT\"', 0),
(121, 36, '\"NOT\"', 1),
(122, 36, '\"B OT\"', 0),
(123, 36, '\"BE OR NOT\"', 0),
(124, 36, '\"OR NOT\"', 0),
(125, 37, '\"E\"', 1),
(126, 37, '\"B\"', 0),
(127, 37, '\" \"', 0),
(128, 37, '\"TO B\"', 0),
(129, 38, '20', 1),
(130, 38, 'Ingen ting', 0),
(131, 38, '5', 0),
(132, 38, '18', 0),
(133, 39, '111', 1),
(134, 39, '100', 0),
(135, 39, '101', 0),
(136, 39, '110', 0),
(137, 40, 'Alle tegnene i strengen text', 1),
(138, 40, 'Annenhvert tegn i strengen text', 0),
(139, 40, 'Verdiene 0 til 11', 0),
(140, 40, 'Verdiene 1 til 12', 0),
(141, 41, 'variabel', 1),
(142, 41, 'Operator presedens', 0),
(143, 41, 'input', 0),
(144, 41, 'print', 0),
(145, 42, 'Kan definere indeks selv', 1),
(146, 42, 'Dictionaries er ikke-muterbare', 0),
(147, 42, 'Dictionaries støtter bare en datatype', 0),
(148, 42, 'De er helt like', 0),
(149, 43, 'Filpekeren', 1),
(150, 43, 'Programpekeren', 0),
(151, 43, 'Minnepekeren', 0),
(152, 43, 'Funksjonspekeren', 0),
(153, 44, '2<sup>63</sup> - 1', 1),
(154, 44, '2<sup>64</sup> - 1', 0),
(155, 44, '2<sup>64</sup>', 0),
(156, 44, '2<sup>32</sup>', 0),
(157, 45, 'Oppskrift med instruksjoner datamaskinen skal utføre', 1),
(158, 45, 'Oppskrift med instruksjoner datamaskin kan velge imellom', 0),
(159, 45, 'Tankekart en datamaskin vil analysere og deretter utfører', 0),
(160, 46, 'Gruppere relaterte funksjoner eller Gjøre det lettere å gjenbruke kode', 1),
(161, 46, 'Samle all kode i en fil', 0),
(162, 46, 'Gjøre koden kjappere', 0),
(163, 47, 'Program skrevet i naturlig språk', 1),
(164, 47, 'Kode som kun forstås av datamaskin', 0),
(165, 47, 'Halvt kode, halvt data', 0),
(166, 47, 'Dårlig kode', 0),
(167, 48, 'Stegvis repetisjon ved at en funksjon kaller seg selv', 1),
(168, 48, 'Prosess der små sjødyr blir lagt på loff sammen med majones', 0),
(169, 48, 'Prosess der man har en tilbakegang til tidligere tilstand', 0),
(170, 48, 'Prosess der man får en bedring og normalisering av situasjon', 0),
(171, 49, '0100 1101 0010', 1),
(172, 49, '0101 1011 0111', 0),
(173, 49, '1101 0011 0100', 0),
(174, 49, '0010 0101 1011', 0),
(179, 51, 'Hvert element i en mengde er unik eller Flere funksjoner for lister kan også brukes på mengder', 1),
(180, 51, 'Menger er ordnet (man kan anta rekkefølge)', 0),
(181, 51, 'Mengder er muterbare', 0),
(182, 52, '575', 1),
(183, 52, '312', 0),
(184, 52, '792', 0),
(185, 52, '1047', 0),
(186, 53, 'Θ(log<sub>2</sub> n)', 1),
(187, 53, 'Θ(1/n)', 0),
(188, 53, 'Θ(1/n<sup>2</sup>)', 0),
(189, 53, 'Θ(n log n)', 0),
(190, 54, 'Θ(n)', 1),
(191, 54, 'Θ(1)', 0),
(192, 54, 'Θ(n log n)', 0),
(193, 54, 'Θ(n<sup>2</sup>)', 0),
(194, 55, 'Binærsøk', 1),
(195, 55, 'Sekvensielt søk', 0),
(196, 55, 'Innstikksortering', 0),
(197, 55, 'Fakultet', 0),
(198, 56, 'Teller antall forekomster av elementene i lista a_list', 1),
(199, 56, 'Sorterer lista a_list i stigende rekkefølge', 0),
(200, 56, 'Teller hvor mange elementer lista a_list har', 0),
(201, 56, 'Gjør om lista a_list til dictionary', 0),
(202, 57, 'Skriver ut navn på alle presidentene i lista', 1),
(203, 57, 'Ingen ting', 0),
(204, 57, 'Skriver ut antall presidenter', 0),
(205, 57, 'Skriver ut posisjonen til alle presidentene i lista', 0),
(206, 58, 'Rette opp skrivefeil eller Teste programmet eller Rette opp logiske feil', 1),
(207, 58, 'Designe programmet', 0),
(208, 59, 'Serialisering av objekter eller Lagrer/laster datastrukturer som lagres binært til fil', 1),
(209, 59, 'Lagrer/laster datastrukturer som lagres som tekstfiler', 0),
(210, 59, 'Muliggjør random-aksess (tilfeldig) lagring av tekstfiler', 0),
(211, 60, 'Den er rekursiv eller Beregner fakultet', 1),
(212, 60, 'Den er ikke rekursiv', 0),
(213, 60, 'Teller antall elementer i ei liste', 0),
(214, 61, 'Present and Absent', 1),
(215, 61, 'Pin and Absent', 0),
(216, 61, 'Pin and Award', 0),
(217, 61, 'Performance and Affordance', 0),
(218, 62, 'løkker inne i andre løkker', 1),
(219, 62, 'løkker som utføres etter hverandre', 0),
(220, 62, 'flere løkker som utføres avhengig av betingelse', 0),
(221, 62, 'evige løkker', 0),
(222, 63, 'Gi en variabel en verdi', 1),
(223, 63, 'Skrive ut verdi til skjerm', 0),
(224, 63, 'Hente verdi fra bruker', 0),
(225, 63, 'Teste om en variabel har en verdi', 0),
(226, 64, 'return', 1),
(227, 64, 'return_back', 0),
(228, 64, 'eval', 0),
(229, 64, 'evaluation', 0),
(230, 65, 'presidents[2:5]', 1),
(231, 65, 'presidents[3:3]', 0),
(232, 65, 'presidents[3:5]', 0),
(233, 65, 'presidents[2:4]', 0),
(234, 66, 'presidents[1::2] eller presidents[1:6:2]', 1),
(235, 66, 'presidents[2:4:6]', 0),
(236, 66, 'presidents[1:3:5]', 0),
(237, 67, 'presidents[3:3]=[\'George\']', 1),
(238, 67, 'presidents[3]=\'George\'', 0),
(239, 67, 'presidents[3:]=[\'George\']', 0),
(240, 67, 'presidents[3:4]=[\'George\']', 0),
(241, 68, 'math.pi', 1),
(242, 68, 'math.π', 0),
(243, 68, 'pi', 0),
(244, 68, 'get(pi)', 0),
(245, 69, 'Får feilmelding', 1),
(246, 69, '\"6\"', 0),
(247, 69, '\"[6,7]\"', 0),
(248, 69, 'To tilfeldige tall fra mengden A', 0),
(249, 70, 'Sjekker (nesten) alle rutene i brettet 4 ganger eller Kjøretiden utvikler seg kvadratisk som en funksjon av n2 eller Seiersjekken vil bli tregere jo større brettet er', 1),
(250, 70, 'Seiersjekken går like fort uansett hvor stort brettet er', 0),
(251, 71, 'Kjøretiden utvikler seg som en funksjon av 1 eller Seirerssjekken går like fort uansett hvor stort brettet er', 1),
(252, 71, 'Seierssjekken vil bli tregere jo større brett som brukes', 0),
(253, 71, 'Kjøretiden utvikler seg som en funksjon av n', 0),
(254, 72, 'Θ(log<sub>2</sub> n)', 1),
(255, 72, 'Θ(1)', 0),
(256, 72, 'Θ(1/n)', 0),
(257, 72, 'Θ(n log n)', 0),
(258, 73, 'Θ(n)', 1),
(259, 73, 'Θ(1)', 0),
(260, 73, 'Θ(0)', 0),
(261, 73, 'Θ(n<sup>2</sup>)', 0),
(262, 74, 'Θ(1)', 1),
(263, 74, 'Θ(0)', 0),
(264, 74, 'Θ(n)', 0),
(265, 74, 'Θ(n<sup>2</sup>)', 0),
(266, 75, 'Liste', 1),
(267, 75, 'Tuppel', 0),
(268, 76, 'Alle datatyper, samt lister', 1),
(269, 76, 'Kun en datatype', 0),
(270, 76, 'Maks to datatyper', 0),
(271, 76, 'Alle datatyper utenom lister', 0),
(272, 77, 'Worst-case tidsbruk er O(log n) eller Krever sortert liste', 1),
(273, 77, 'Gir alltid raskeste søk', 0),
(274, 77, 'Tidsbruk er O(n<sup>2</sup)', 0),
(275, 78, 'Worst-case tidsbruk er: O(n<sup>2</sup>) eller Krever lite ekstra plass i minnet', 1),
(276, 78, 'Worst-case tidsbruk er: O(log n)', 0),
(277, 78, 'Er rekursiv', 0),
(278, 79, 'Worst-case tidsbruk: O(n) eller Kan være raskere enn binærsøk', 1),
(279, 79, 'Krever sortert liste', 0),
(280, 79, 'Worst-case tidsbruk: O(n<sup>2</sup>)', 0),
(281, 80, 'Enklere å lese kode eller Gjenbruk av kode eller Bedre støtte for samarbeid', 1),
(282, 80, 'Programmene kjører raskere', 0),
(283, 81, '8', 1),
(284, 81, 'Ingen', 0),
(285, 81, '7', 0),
(286, 81, '4, 5, 6, 7, 8', 0),
(287, 82, 'Sekvensielt søk', 1),
(288, 82, 'Binærsøk', 0),
(289, 82, 'Innstikksortering', 0),
(290, 82, 'Fakultet', 0),
(291, 83, 'Θ(log n)', 1),
(292, 83, 'Θ(n)', 0),
(293, 83, 'Θ(2<sup>n</sup>)', 0),
(294, 83, 'Θ(n log n)', 0),
(295, 84, 'Θ(2<sup>n</sup>)', 1),
(296, 84, 'Θ(n)', 0),
(297, 84, 'Θ(log n)', 0),
(298, 84, 'Θ(n log n)', 0),
(299, 85, 'A', 1),
(300, 85, 'B', 0),
(301, 86, 'float', 1),
(302, 86, 'int', 0),
(303, 86, 'string', 0),
(304, 86, 'boolean', 0),
(305, 87, 'string', 1),
(306, 87, 'int', 0),
(307, 87, 'float', 0),
(308, 87, 'boolean', 0),
(309, 88, 'boolean', 1),
(310, 88, 'string', 0),
(311, 88, 'int', 0),
(312, 88, 'float', 0),
(313, 89, 'string', 1),
(314, 89, 'int', 0),
(315, 89, 'float', 0),
(316, 89, 'boolean', 0),
(317, 90, 'float', 1),
(318, 90, 'int', 0),
(319, 90, 'string', 0),
(320, 90, 'boolean', 0),
(321, 91, 'string', 1),
(322, 91, 'int', 0),
(323, 91, 'float', 0),
(324, 91, 'boolean', 0),
(325, 92, 'int', 1),
(326, 92, 'float', 0),
(327, 92, 'string', 0),
(328, 92, 'boolean', 0),
(329, 93, 'int eller string', 1),
(330, 93, 'float', 0),
(331, 93, 'boolean', 0),
(332, 94, 'str()', 1),
(333, 94, 'value_to_string()', 0),
(334, 94, 'to_string()', 0),
(335, 94, 'Er ikke mulig', 0),
(336, 95, 'isdigit()', 1),
(337, 95, 'isalnum()', 0),
(338, 95, 'isalpha()', 0),
(339, 95, 'isupper()', 0),
(340, 96, '+', 1),
(341, 96, '-', 0),
(342, 96, ',', 0),
(343, 96, '.', 0),
(344, 97, 'a', 1),
(345, 97, 'r+', 0),
(346, 97, 'w+', 0),
(347, 97, 'r', 0),
(348, 98, 'split()', 1),
(349, 98, 'strip()', 0),
(350, 98, 'lower()', 0),
(351, 98, 'upper()', 0),
(352, 99, '4d 6f 72 6e 61', 1),
(353, 99, '4e 54 4e 55 21', 0),
(354, 99, '4e 65 69 64 61', 0),
(355, 99, '55 66 6g 7h 61', 0),
(356, 100, 'while-løkke', 1),
(357, 100, 'for-løkke', 0),
(358, 100, 'if-setning', 0),
(359, 100, 'print', 0),
(360, 101, 'while-løkke', 1),
(361, 101, 'for-løkke', 0),
(362, 101, 'if-setning', 0),
(363, 101, 'print', 0),
(364, 102, 'for-løkke', 1),
(365, 102, 'while-løkke', 0),
(366, 102, 'if-setning', 0),
(367, 102, 'else', 0),
(368, 103, 'for-løkke', 1),
(369, 103, 'while-løkke', 0),
(370, 103, 'if-setning', 0),
(371, 103, 'else', 0),
(372, 122, 'False', 1),
(373, 122, 'True', 0),
(374, 105, '11bit', 1),
(375, 105, 'En byte (8 bit)', 0),
(376, 105, '12 bit', 0),
(377, 105, '2 bytes (16 bit)', 0),
(378, 106, '16', 1),
(379, 106, '4', 0),
(380, 106, '2', 0),
(381, 106, '256', 0),
(382, 107, 'Pseudokode', 1),
(383, 107, 'Alltid som Pythonkode', 0),
(384, 107, 'Må beskrives enten som Java- eller Pythonkode', 0),
(385, 107, 'Må beskrives i ett eller annet programmeringsspråk', 0),
(386, 108, 'Sekvensielt (etter hverandre)', 1),
(387, 108, 'Tilfeldig plassering (RAM)', 0),
(388, 108, 'Starter på midten og fyller til det er fullt', 0),
(389, 108, 'Starter bakerst og jobber seg framover', 0),
(390, 109, 'presidents[4]=\'Donald\'', 1),
(391, 109, 'presidents[3]=\'Donald\'', 0),
(392, 109, 'presidents[3:4]=\'Donald\'', 0),
(393, 109, 'presidents[4:5]=\'Donald\'', 0),
(394, 110, 'p[4]=\'Jens\'', 1),
(395, 110, 'p[3]=\'Jens\'', 0),
(396, 110, 'p[3:4]=\'Jens\'', 0),
(397, 110, 'p[4:5]=\'Jens\'', 0),
(400, 112, 'presidents[3] eller presidents[3:4]', 1),
(401, 112, 'presidents[0:4]', 0),
(402, 112, 'presidents[4]', 0),
(403, 113, '111', 1),
(404, 113, '100', 0),
(405, 113, '101', 0),
(406, 113, '110', 0),
(407, 114, '1) Åpne, 2) Lese/Skrive, 3) Lukke', 1),
(408, 114, '1) Lukke, 2) Lese/Skrive, 3) Åpne', 0),
(409, 114, '1) Lese/Skrive, 2) Åpne', 0),
(410, 114, '1) Lese/Skrive, 2) Åpne, 3) Lukke', 0),
(411, 115, 'Ja', 1),
(412, 115, 'Nei', 0),
(413, 116, 'Eneste som kreves er å følge oppskriften som oppgis eller Ha nok informasjon til å beskrive unike og komplette steg', 1),
(414, 116, 'Stegene som beskrives skal ha felles karakteristikker', 0),
(415, 116, 'Flere løsninger beskrives ved hjelp av distinkte steg', 0),
(416, 117, 'False', 1),
(417, 117, 'True', 0),
(418, 118, 'True', 1),
(419, 118, 'False', 0),
(420, 119, 'Linje for linje eller Fra øverst til neders', 1),
(421, 119, 'Paragraf for paragraf', 0),
(422, 119, 'Fra nederst til øverst', 0),
(423, 120, 'Kompilator eller Tolker', 1),
(424, 120, 'Word prosessor', 0),
(425, 120, 'Task Manager', 0),
(426, 121, 'try: ... except <ExceptionName>: … eller try: ... except <ExceptionName>: ... else: ... finally:', 1),
(427, 121, 'exception <ExceptionName>: ... try:', 0),
(428, 121, 'exception: ... try <ExceptionName>:', 0),
(531, 123, '1', 0),
(532, 123, '8', 0),
(533, 123, '2', 1),
(534, 123, '10', 0),
(535, 124, '10', 0),
(536, 124, '0010', 0),
(537, 124, '010', 0),
(538, 124, '1010', 1),
(539, 125, 'C', 0),
(540, 125, 'Maskinspråk', 1),
(541, 125, 'C#', 0),
(542, 125, 'Python', 0),
(543, 126, '0111', 0),
(544, 126, '14', 0),
(545, 126, 'E', 1),
(546, 126, '15', 0),
(547, 127, '111', 0),
(548, 127, '101', 0),
(549, 127, '11E', 1),
(550, 127, '000', 0);