-- drop database ifefaultdb;
-- use defaultdb;
CREATE TABLE
  User (
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(52) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'learner', 'instructor') NOT NULL,
    CONSTRAINT PK_User PRIMARY KEY (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci 
  ENGINE = InnoDB;


CREATE TABLE
  Admin (
    admin_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Admin PRIMARY KEY (admin_id),
    CONSTRAINT FK_Admin_User FOREIGN KEY (admin_id) REFERENCES User (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Learner (
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    learner_default_language VARCHAR(20) NOT NULL,
    CONSTRAINT PK_Learner PRIMARY KEY (learner_id),
    CONSTRAINT FK_Learner_User FOREIGN KEY (learner_id) REFERENCES User (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Instructor (
    instructor_id MEDIUMINT UNSIGNED NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    academic_degree VARCHAR(50) NOT NULL,
    working_unit VARCHAR(100) NOT NULL,
    academic_title VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    instructor_type ENUM ('instructor', 'vip_instructor') NOT NULL,
    CONSTRAINT PK_Instructor PRIMARY KEY (instructor_id),
    CONSTRAINT FK_Instructor_User FOREIGN KEY (instructor_id) REFERENCES User (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  VipInstructor (
    vip_instructor_id MEDIUMINT UNSIGNED NOT NULL,
    tin_number CHAR(9) NOT NULL,
    country VARCHAR(20) NOT NULL,
    tax_filling_date DATE NOT NULL,
    zip_code VARCHAR(6) NOT NULL,
    image VARCHAR(2084) NOT NULL,
    CONSTRAINT PK_VipInstructor PRIMARY KEY (vip_instructor_id),
    CONSTRAINT FK_VipInstructor_Instructor FOREIGN KEY (vip_instructor_id) REFERENCES Instructor (instructor_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Category (
    category_id TINYINT UNSIGNED NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Category PRIMARY KEY (category_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  SubCategory (
    id TINYINT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    category_id TINYINT UNSIGNED NOT NULL,
    CONSTRAINT PK_SubCategory PRIMARY KEY (id),
    CONSTRAINT FK_SubCategory_Category FOREIGN KEY (category_id) REFERENCES Category (category_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;
  
CREATE TABLE
  Tier (
    id TINYINT UNSIGNED AUTO_INCREMENT,
    price MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Tier PRIMARY KEY (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Course (
    id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(60) NOT NULL,
    subtitle VARCHAR(120) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    language VARCHAR(27) NOT NULL,
    requirement VARCHAR(160) NOT NULL,
    image VARCHAR(2084) NOT NULL,
    tier_id TINYINT UNSIGNED NOT NULL,
    status ENUM ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    subcategory_id TINYINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Course PRIMARY KEY (id),
    CONSTRAINT FK_Course_SubCategory FOREIGN KEY (subcategory_id) REFERENCES SubCategory (id),
    CONSTRAINT FK_Course_Tier FOREIGN KEY (tier_id) REFERENCES Tier (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  CourseObjective (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    course_objective VARCHAR(160) NOT NULL,
    CONSTRAINT PK_CourseObjective PRIMARY KEY (course_id, course_objective),
    CONSTRAINT FK_CourseObjective_Course FOREIGN KEY (course_id) REFERENCES Course (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;

CREATE TABLE
  Section (
    id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    title VARCHAR(80) NOT NULL,
    number_of_item SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    duration TIME,
    status ENUM ('pending', 'publish', 'unpublish') NOT NULL DEFAULT 'pending',
    CONSTRAINT PK_Section PRIMARY KEY (course_id, id),
    CONSTRAINT FK_Section_Course FOREIGN KEY (course_id) REFERENCES Course (id),
    INDEX idx_id (course_id, id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;

CREATE TABLE SectionOrder (
    section_id SMALLINT UNSIGNED,
    course_id MEDIUMINT UNSIGNED,
    order_section_id SMALLINT UNSIGNED,
    priority TINYINT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT PK_SectionOrder PRIMARY KEY (course_id, section_id),
    CONSTRAINT FK_SectionOrder_Section FOREIGN KEY (course_id, section_id) REFERENCES Section (course_id, id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
ENGINE = InnoDB;


CREATE TABLE Item (
    id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(255) NOT NULL,
    item_type ENUM ('lecture', 'quiz') NOT NULL,
    CONSTRAINT PK_Item PRIMARY KEY (id, section_id, course_id),
    INDEX idx_id (id, section_id, course_id),
    CONSTRAINT FK_Item_Section FOREIGN KEY (course_id, section_id) REFERENCES Section (course_id, id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
ENGINE = InnoDB;

CREATE TABLE ItemOrder (
    item_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    order_item_id SMALLINT UNSIGNED NOT NULL,
    priority TINYINT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT PK_ItemOrder PRIMARY KEY (item_id, section_id, course_id),
    CONSTRAINT FK_ItemOrder_Item FOREIGN KEY (item_id, section_id, course_id) REFERENCES Item (id, section_id, course_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE
  ItemHistory (
    item_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    create_at DATETIME NOT NULL,
    CONSTRAINT PK_ItemHistory PRIMARY KEY (item_id, section_id, course_id, create_at),
    CONSTRAINT FK_ItemHistory_Item FOREIGN KEY (item_id, section_id, course_id) REFERENCES Item (id, section_id, course_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Lecture (
    id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    resource VARCHAR(2084) NOT NULL,
    url VARCHAR(2084) NOT NULL,
    duration TIME NOT NULL,
    CONSTRAINT PK_Lecture PRIMARY KEY (id, section_id, course_id),
    CONSTRAINT FK_Lecture_Item FOREIGN KEY (id, section_id, course_id) REFERENCES Item (id, section_id, course_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  LectureSubtitle (
    lecture_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    subtitle_language VARCHAR(27) NOT NULL,
    subtitle VARCHAR(2084) NOT NULL,
    CONSTRAINT PK_LectureSubtitle PRIMARY KEY (lecture_id, section_id, course_id, subtitle_language),
    CONSTRAINT FK_LectureSubtitle_Lecture FOREIGN KEY (lecture_id, section_id, course_id) REFERENCES Lecture (id, section_id, course_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Quiz (
    id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Quiz PRIMARY KEY (id, section_id, course_id),
    CONSTRAINT FK_Quiz_Item FOREIGN KEY (id, section_id, course_id) REFERENCES Item (id, section_id, course_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  QuizQA (
    id TINYINT UNSIGNED NOT NULL,
    quiz_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    question VARCHAR(600) NOT NULL,
    CONSTRAINT PK_QuizQA PRIMARY KEY (id, quiz_id, section_id, course_id),
    INDEX Idx (id, quiz_id, section_id, course_id),
    CONSTRAINT FK_QuizQA_Quiz FOREIGN KEY (quiz_id, section_id, course_id) REFERENCES Quiz (id, section_id, course_id) 
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  QuizQAAnswerDetail (
    id TINYINT UNSIGNED NOT NULL,
    quiz_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    answer VARCHAR(600) NOT NULL,
    explanation VARCHAR(600) NOT NULL,
    CONSTRAINT PK_QuizQAAnswerDetail PRIMARY KEY (id, quiz_id, section_id, course_id),
    INDEX Idx (id, quiz_id, section_id, course_id),
    CONSTRAINT FK_QuizQAAnswerDetail_Quiz FOREIGN KEY (quiz_id, section_id, course_id) REFERENCES Quiz (id, section_id, course_id) 
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;

CREATE TABLE QuizQAAnswerMapping (
  quiz_id SMALLINT UNSIGNED NOT NULL,
  section_id SMALLINT UNSIGNED NOT NULL,
  course_id MEDIUMINT UNSIGNED NOT NULL,
  quiz_qa_id TINYINT UNSIGNED NOT NULL,
  answer_detail_id TINYINT UNSIGNED NOT NULL,
  isCorrectAnswer BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT PK_QuizQAAnswerMapping PRIMARY KEY (quiz_id, section_id, course_id, quiz_qa_id, answer_detail_id),
  CONSTRAINT FK_QuizQAAnswerMapping_QuizQA FOREIGN KEY (quiz_id, section_id, course_id, quiz_qa_id) REFERENCES QuizQA (quiz_id, section_id, course_id, id),
  CONSTRAINT FK_QuizQAAnswerMapping_QuizQAAnswerDetail FOREIGN KEY (quiz_id, section_id, course_id, answer_detail_id) REFERENCES QuizQAAnswerDetail (quiz_id, section_id, course_id, id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Question (
    question_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    item_id SMALLINT UNSIGNED NOT NULL,
    question_datetime DATETIME NOT NULL,
    question_message VARCHAR(600) NOT NULL,
    user_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Question PRIMARY KEY (question_id, item_id, section_id, course_id),
    CONSTRAINT FK_Question_Item FOREIGN KEY (item_id, section_id, course_id) REFERENCES Item (id, section_id, course_id),
    CONSTRAINT FK_Question_User FOREIGN KEY (user_id) REFERENCES User (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Answer (
    question_id SMALLINT UNSIGNED NOT NULL,
    answer_id SMALLINT UNSIGNED NOT NULL,
    item_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    answer_datetime DATETIME NOT NULL,
    answer_message VARCHAR(600) NOT NULL,
    user_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Answer PRIMARY KEY (
      question_id,
      answer_id,
      item_id,
      course_id,
      section_id
    ),
    CONSTRAINT FK_Question FOREIGN KEY (question_id, item_id, section_id, course_id) REFERENCES Question (question_id, item_id, section_id, course_id),
    CONSTRAINT FK_Answer_User FOREIGN KEY (user_id) REFERENCES User (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  ShoppingCart (
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_ShoppingCart PRIMARY KEY (learner_id),
    CONSTRAINT FK_Learner FOREIGN KEY (learner_id) REFERENCES Learner (learner_id),
    CONSTRAINT FK_ShoppingCart_Course FOREIGN KEY (course_id) REFERENCES Course (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE Payment (
    id MEDIUMINT UNSIGNED AUTO_INCREMENT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price MEDIUMINT UNSIGNED DEFAULT 0,
    total_course MEDIUMINT UNSIGNED DEFAULT 0,
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_Payment PRIMARY KEY (id),
    CONSTRAINT FK_Payment_Learner FOREIGN KEY (learner_id) REFERENCES Learner (learner_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

CREATE TABLE
  EnrollementCourse (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    course_completion_date DATE,
    course_rating SMALLINT UNSIGNED DEFAULT 0,
    course_comment VARCHAR(2000),
    final_course_price MEDIUMINT UNSIGNED NOT NULL,
    payment_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_EnrollementCourse PRIMARY KEY (course_id, learner_id),
    CONSTRAINT FK_EnrollementCourse_Course FOREIGN KEY (course_id) REFERENCES Course (id),
    CONSTRAINT FK_EnrollementCours_Learner FOREIGN KEY (learner_id) REFERENCES Learner (learner_id),
    CONSTRAINT FK_Payment FOREIGN KEY (payment_id) REFERENCES Payment (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  StudentAnswerQA (
    quiz_id SMALLINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    course_id MEDIUMINT UNSIGNED NOT NULL,
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    quiz_qa_id TINYINT UNSIGNED NOT NULL,
    answer_detail_id TINYINT UNSIGNED NOT NULL,  
    CONSTRAINT PK_StudentAnswerQA PRIMARY KEY (quiz_id, section_id, course_id, learner_id, quiz_qa_id, answer_detail_id),
    CONSTRAINT FK_StudentAnswerQA_QuizQAAnswerMapping FOREIGN KEY (quiz_id, section_id, course_id, quiz_qa_id, answer_detail_id) REFERENCES QuizQAAnswerMapping (quiz_id, section_id, course_id, quiz_qa_id, answer_detail_id),
    CONSTRAINT FK_StudentAnswerQA_EnrollementCourse FOREIGN KEY (course_id, learner_id) REFERENCES EnrollementCourse (course_id, learner_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


-- Thu
CREATE TABLE
  CourseInstructor (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    instructor_id MEDIUMINT UNSIGNED NOT NULL,
    profit_percent SMALLINT UNSIGNED NOT NULL,
    CONSTRAINT PK_CourseInstructor PRIMARY KEY (course_id, instructor_id),
    CONSTRAINT FK_CourseInstructor_Course FOREIGN KEY (course_id) REFERENCES Course (id),
    CONSTRAINT FK_CourseInstructor_Instructor FOREIGN KEY (instructor_id) REFERENCES Instructor (instructor_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  CourseInstructorHistory (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    instructor_id MEDIUMINT UNSIGNED NOT NULL,
    create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    course_profit_percent SMALLINT UNSIGNED NOT NULL,
    CONSTRAINT PK_CourseInstructorHistory PRIMARY KEY (course_id, instructor_id, create_at),
    CONSTRAINT FK_CourseInstructor_CourseID FOREIGN KEY (course_id, instructor_id) REFERENCES CourseInstructor (course_id, instructor_id)
    -- CHECK (
    --   course_profit_percent >= 0
    --   AND course_profit_percent <= 100
    -- )
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  CourseProgress (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    section_id SMALLINT UNSIGNED NOT NULL,
    item_id SMALLINT UNSIGNED NOT NULL,
    learner_id MEDIUMINT UNSIGNED NOT NULL,
    CONSTRAINT PK_CourseProgress PRIMARY KEY (course_id, section_id, item_id, learner_id),
    CONSTRAINT FK_CourseProgress_EnrollementCourse FOREIGN KEY (course_id, learner_id) REFERENCES EnrollementCourse (course_id, learner_id),
    CONSTRAINT FK_CourseProgress_Item FOREIGN KEY (course_id, section_id, item_id) REFERENCES Item (course_id, section_id, id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Adjustment (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    admin_id MEDIUMINT UNSIGNED NOT NULL,
    create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(10000) NOT NULL,
    CONSTRAINT PK_Adjustment PRIMARY KEY (course_id, admin_id, create_at),
    CONSTRAINT FK_Adjustment_Course FOREIGN KEY (course_id) REFERENCES Course (id),
    CONSTRAINT FK_Adjustment_Admin FOREIGN KEY (admin_id) REFERENCES Admin (admin_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  Notification (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    notification_type ENUM (
      'adjustment',
      'promotional_program',
      'course_highlight',
      'price_conversion',
      'start_of_course',
      'end_of_course'
    ) NOT NULL,
    content VARCHAR(10000) NOT NULL,
    CONSTRAINT PK_Notification PRIMARY KEY (course_id, notification_type),
    CONSTRAINT FK_Notification_Course FOREIGN KEY (course_id) REFERENCES Course (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  PromotionalProgram (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    content VARCHAR(10000) NOT NULL,
    day_start DATE NOT NULL,
    day_end DATE NOT NULL,
    tier_difference TINYINT UNSIGNED NOT NULL,
    CONSTRAINT PK_PromotionalProgram PRIMARY KEY (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;

CREATE TABLE
  PromotionalProgramHistory (
    id INT UNSIGNED NOT NULL,
    create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tier_difference TINYINT UNSIGNED NOT NULL,
    CONSTRAINT PK_PromotionalProgramHistory PRIMARY KEY (id, create_at),
    CONSTRAINT FK_PromotionalProgramHistory_PromotionalProgram FOREIGN KEY (id) REFERENCES PromotionalProgram (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  CourseHighlight (
    id MEDIUMINT UNSIGNED NOT NULL,
    downloadable_documents SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    students_enrolled MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    average_rating FLOAT NOT NULL DEFAULT 0.0,
    sale_price MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    no_sections SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    duration MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT PK_CourseHighlight PRIMARY KEY (id),
    CONSTRAINT FK_CourseHighlight_Course FOREIGN KEY (id) REFERENCES Course (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  MonthlyCourseIncome (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    final_amount INT UNSIGNED NOT NULL,
    CONSTRAINT PK_MonthlyCourseIncome PRIMARY KEY (course_id, date),
    CONSTRAINT FK_MonthlyCourseIncome_Course FOREIGN KEY (course_id) REFERENCES Course (id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;


CREATE TABLE
  MonthlyCourseIncomeVipInstructor (
    course_id MEDIUMINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    vip_instructor_id MEDIUMINT UNSIGNED NOT NULL,
    revenue INT UNSIGNED NOT NULL,
    CONSTRAINT PK_MonthlyCourseIncomeVipInstructor PRIMARY KEY (course_id, date, vip_instructor_id),
    CONSTRAINT FK_MonthlyCourseIncomeVipInstructor_Course FOREIGN KEY (course_id, date) REFERENCES MonthlyCourseIncome (course_id, date),
    CONSTRAINT FK_MonthlyCourseIncomeVipInstructor_VipInstructor FOREIGN KEY (vip_instructor_id) REFERENCES VipInstructor (vip_instructor_id)
  ) DEFAULT CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci
  ENGINE = InnoDB;

alter table Course auto_increment = 1;
alter table Tier auto_increment = 1;
alter table Payment auto_increment = 1;
alter table PromotionalProgram auto_increment = 1;


create index idx_title_on_course on Course (title);
create index idx_date_on_payment on Payment (date);