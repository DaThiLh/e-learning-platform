use defaultdb;

-- (27) Cập nhật giá bán khóa học.
drop PROCEDURE update_sale_price_course_highlight;
DELIMITER //

CREATE PROCEDURE update_sale_price_course_highlight(IN inp_course_id MEDIUMINT) 
BEGIN 
  DECLARE day_start_promotion DATE;
  DECLARE day_end_promotion DATE;
  DECLARE tier_difference_value TINYINT;
  DECLARE tier_id_in_course TINYINT; 
  DECLARE calculated_price MEDIUMINT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while updating the sale price';
  END;

  START TRANSACTION;

  SELECT day_start, day_end, tier_difference
  INTO day_start_promotion, day_end_promotion, tier_difference_value
  FROM PromotionalProgram
  WHERE DATE(NOW()) BETWEEN day_start AND day_end
  LIMIT 1;

  SELECT tier_id INTO tier_id_in_course
   FROM Course
   WHERE id = inp_course_id;

IF day_start_promotion IS NOT NULL AND day_end_promotion IS NOT NULL THEN
     SET calculated_price = (
       CASE 
         WHEN tier_id_in_course <= tier_difference_value THEN 
           (SELECT price FROM Tier WHERE id = 1)
         ELSE 
           (SELECT price FROM Tier WHERE id = LEAST(tier_id_in_course - tier_difference_value, (SELECT MAX(id) FROM Tier)))
       END
     );
     
     UPDATE CourseHighlight
     SET sale_price = calculated_price
     WHERE id = inp_course_id;
END IF;

  COMMIT;
END //

DELIMITER ;

-- Truy vấn 1: Xem các khóa học đã tạo.
 
drop PROCEDURE get_courses_by_instructor_id;
DELIMITER //

CREATE PROCEDURE get_courses_by_instructor_id(IN inp_instructor_id INT)
BEGIN
  DECLARE totalCourses INT;
  DECLARE i INT DEFAULT 1;
  DECLARE course_id_to_update MEDIUMINT;
  DECLARE offset INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  CREATE TEMPORARY TABLE tempCourseInstructor (
    course_id MEDIUMINT PRIMARY KEY
  );

  INSERT INTO tempCourseInstructor (course_id)
  SELECT course_id
  FROM CourseInstructor 
  WHERE instructor_id = inp_instructor_id;

  SELECT COUNT(*) INTO totalCourses FROM tempCourseInstructor;

  WHILE i <= totalCourses DO
    SET offset = i - 1;

    SELECT course_id INTO course_id_to_update
    FROM tempCourseInstructor
    LIMIT offset, 1;

    CALL update_sale_price_course_highlight(course_id_to_update);

    SET i = i + 1;
  END WHILE;

  DROP TEMPORARY TABLE tempCourseInstructor;

  SELECT c.id, c.title, sc.name AS subcategory_name, ch.students_enrolled,
         ch.average_rating, ch.sale_price, u.full_name
  FROM Course c
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci ON c.id = ci.course_id
  JOIN User u ON u.id = ci.instructor_id
  WHERE ci.instructor_id = inp_instructor_id;

END //

DELIMITER ;

select * from Instructor;
CALL get_courses_by_instructor_id(2);


-- Truy vấn: (3) Cho biết thông tin danh sách khoá học dựa vào từ khoá tìm kiếm theo tên khoá học.
drop procedure search_courses_by_keyword;
DELIMITER //
CREATE PROCEDURE search_courses_by_keyword(IN keyword VARCHAR(60))
BEGIN
  DECLARE totalCourses INT;
  DECLARE i INT DEFAULT 1;
  DECLARE course_id_to_update MEDIUMINT;
  DECLARE offset INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  CREATE TEMPORARY TABLE tempCourseInstructor (
    course_id MEDIUMINT PRIMARY KEY
  );

  INSERT INTO tempCourseInstructor (course_id)
  SELECT id
  FROM Course 
  WHERE title LIKE CONCAT('%', keyword, '%');

  SELECT COUNT(*) INTO totalCourses FROM tempCourseInstructor;

  WHILE i <= totalCourses DO
    SET offset = i - 1;

    SELECT course_id INTO course_id_to_update
    FROM tempCourseInstructor
    LIMIT offset, 1;

    CALL update_sale_price_course_highlight(course_id_to_update);

    SET i = i + 1;
  END WHILE;

  DROP TEMPORARY TABLE tempCourseInstructor;

  SELECT c.id, c.title, sc.name AS subcategory_name, ch.students_enrolled, 
         ch.average_rating, ch.sale_price, u.full_name AS instructor_name
  FROM Course c
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci ON ci.course_id = c.id
  JOIN User u ON u.id = ci.instructor_id
  WHERE c.title LIKE CONCAT('%', keyword COLLATE utf8mb4_unicode_ci, '%')
    AND (u.role = 'instructor' OR u.role = 'vipinstructor')
    AND c.status = 'approved';

END //

DELIMITER ;

-- Truy vấn: (4) Cho biết danh sách các khoá học mà học viên có thể xem được.
drop procedure get_courses_for_student;
DELIMITER //

CREATE PROCEDURE get_courses_for_student()
BEGIN
  DECLARE totalCourses INT;
  DECLARE i INT DEFAULT 1;
  DECLARE course_id_to_update MEDIUMINT;
  DECLARE offset INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  CREATE TEMPORARY TABLE tempCourses (
    course_id MEDIUMINT PRIMARY KEY
  ); 

  INSERT INTO tempCourses (course_id)
  SELECT id FROM course WHERE status = 'approved';

  SELECT COUNT(*) INTO totalCourses FROM tempCourses;

  WHILE i <= totalCourses DO
    SET offset = i - 1;

    SELECT course_id INTO course_id_to_update
    FROM tempCourseInstructor
    LIMIT offset, 1;

    CALL update_sale_price_course_highlight(course_id_to_update);

    SET i = i + 1;
  END WHILE;

  DROP TEMPORARY TABLE tempCourses;

  SELECT c.id, c.title, sc.name AS subcategory_name, ch.students_enrolled, 
         ch.average_rating, ch.sale_price, u.full_name AS instructor_name
  FROM Course c
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci on ci.course_id = c.id
  JOIN User u on u.id = ci.instructor_id 
  WHERE (u.role = 'instructor' or u.role = 'vipinstrutor')
    AND c.status = 'approved';
  COMMIT;
END //

DELIMITER ;

CALL get_courses_for_student();

-- Truy vấn: (5) Thêm khóa học vào giỏ hàng.
DELIMITER //

CREATE PROCEDURE add_course_to_cart(IN p_learner_id MEDIUMINT, IN p_course_id MEDIUMINT)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while adding the course to the cart' AS error_message;
  END;

  START TRANSACTION;
  IF EXISTS (SELECT 1 FROM ShoppingCart WHERE learner_id = p_learner_id AND course_id = p_course_id) THEN
    ROLLBACK;
    SELECT 'Error: The course is already in the cart' AS error_message;
  ELSE
    IF EXISTS (SELECT 1 FROM EnrollementCourse WHERE learner_id = p_learner_id AND course_id = p_course_id) THEN
      ROLLBACK;
      SELECT 'Error: The course is already enrolled' AS error_message;
    ELSE
      INSERT INTO ShoppingCart(learner_id, course_id)
      VALUES (p_learner_id, p_course_id);
      COMMIT;
      SELECT * FROM ShoppingCart WHERE learner_id = p_learner_id AND course_id = p_course_id;
    END IF;
  END IF;
END //

DELIMITER ;

CALL add_course_to_cart(5, 1);
-- Truy vấn: (6) Cho biết các danh sách khoá học có trong giỏ hàng của học viên.
drop PROCEDURE get_courses_in_cart;
DELIMITER //

CREATE PROCEDURE get_courses_in_cart(IN learner_id MEDIUMINT)
BEGIN
  DECLARE totalCourses INT;
  DECLARE i INT DEFAULT 1;
  DECLARE course_id_to_update MEDIUMINT;
  DECLARE offset INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses in the cart' AS error_message;
  END;

  CREATE TEMPORARY TABLE tempCoursesInShoppingCart (
    course_id MEDIUMINT PRIMARY KEY
  ); 

  INSERT INTO tempCoursesInShoppingCart (course_id)
  SELECT sc.course_id FROM ShoppingCart sc WHERE sc.learner_id = learner_id;

  SELECT COUNT(*) INTO totalCourses FROM tempCoursesInShoppingCart;

  WHILE i <= totalCourses DO
    SET offset = i - 1;
    SELECT course_id INTO course_id_to_update
    FROM tempCourseInstructor
    LIMIT offset, 1;
    CALL update_sale_price_course_highlight(course_id_to_update);
    SET i = i + 1;
  END WHILE;

  DROP TEMPORARY TABLE tempCoursesInShoppingCart;

  SELECT c.id, c.title, scat.name AS subcategory_name, u.full_name AS instructor_name, 
          ch.students_enrolled, ch.average_rating, ch.sale_price AS sale_price, t.price AS original_price
  FROM ShoppingCart sc 
  JOIN Course c ON sc.course_id = c.id
  JOIN SubCategory scat ON c.subcategory_id = scat.id
  JOIN CourseInstructor ci ON ci.course_id = c.id
  JOIN User u ON ci.instructor_id = u.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN Tier t on c.tier_id = t.id
  WHERE sc.learner_id = learner_id
    AND u.role = 'instructor' OR u.role = 'vipinstrutor';
END //

DELIMITER ;

-- Truy vấn: (7) Thanh toán khoá học.
DELIMITER //

CREATE PROCEDURE create_payment(IN learner_id MEDIUMINT, OUT payment_id INT)
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SET payment_id = NULL;
    SELECT 'Error: An error occurred while paying for the course' AS error_message;
  END;

  START TRANSACTION;

  IF NOT EXISTS (SELECT 1 FROM ShoppingCart WHERE learner_id = learner_id) THEN 
    ROLLBACK;
    SET payment_id = NULL;
    SELECT 'Error: The course is not in the cart' AS error_message;
  ELSE
    INSERT INTO Payment (learner_id) VALUES (learner_id);
    SET payment_id = LAST_INSERT_ID(); 
    COMMIT;
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE create_enrollment_course(
    IN learner_id MEDIUMINT, 
    IN course_id MEDIUMINT, 
    IN payment_id MEDIUMINT UNSIGNED
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while enrolling in the course' AS error_message;
  END;

  START TRANSACTION;

  CALL update_sale_price_course_highlight(course_id);
  SET @final_price = (SELECT sale_price FROM CourseHighlight WHERE id = course_id);
  INSERT INTO EnrollementCourse(learner_id, course_id, payment_id, final_course_price)
  VALUES (learner_id, course_id, payment_id, @final_price);
  COMMIT;

	DELETE FROM ShoppingCart WHERE learner_id = learner_id AND course_id = course_id; 
      
  UPDATE Payment 
  SET total_price = total_price + @final_price, 
      total_course = total_course + 1
 	WHERE id = payment_id;  

  UPDATE CourseHighlight 
  SET students_enrolled = students_enrolled + 1 
  WHERE id = course_id;

  SELECT e.* FROM EnrollementCourse e WHERE e.payment_id = payment_id;
  COMMIT;
END //

DELIMITER ;

-- Truy vấn: (2) Giảng viên tạo khoá học mới.
DELIMITER //

CREATE PROCEDURE create_course(
  IN title VARCHAR(60),
  IN subtitle VARCHAR(120),
  IN description VARCHAR(2000),
  IN language VARCHAR(27),
  IN requirement VARCHAR(160),
  IN image VARCHAR(2084),
  IN tier_id TINYINT UNSIGNED,
  IN subcategory_id TINYINT UNSIGNED,
  OUT course_id INT
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course';
  END;

  START TRANSACTION;
  INSERT INTO Course(title, subtitle, description, language, requirement, image, tier_id, subcategory_id)
  VALUES (title, subtitle, description, language, requirement, image, tier_id, subcategory_id);
  
  SET course_id = LAST_INSERT_ID();
  COMMIT;
END //

DELIMITER ;

SET @course_id = 0;
CALL create_course('title', 'subtitle', 'description', 'language', 'requirement', 'image', 1, 1, @course_id);
SELECT @course_id as id;

-- tạo CourseObjective
DELIMITER //

CREATE PROCEDURE create_course_objective(
  IN course_id MEDIUMINT,
  IN objective VARCHAR(160)
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course';
  END;

  START TRANSACTION;
  INSERT INTO CourseObjective(course_id, course_objective)
  VALUES (course_id, objective);

  SELECT * FROM CourseObjective WHERE course_id = course_id;
  COMMIT;
END //

DELIMITER ;

CALL create_course_objective(@course_id, 'objective');

-- tạo CourseHighlight
DELIMITER //

CREATE PROCEDURE create_course_highlight(
  IN course_id MEDIUMINT
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course highlight';
  END;

  START TRANSACTION;
  INSERT INTO CourseHighlight(id) VALUES (course_id);
  SELECT * FROM CourseHighlight WHERE id = course_id;
  COMMIT;
END //

DELIMITER ;

CALL create_course_highlight(@course_id);

-- tạo giảng viên trong khoá học
DELIMITER //

CREATE PROCEDURE create_course_instructor(
  IN course_id MEDIUMINT,
  IN instructor_id MEDIUMINT,
  IN profit_percent SMALLINT
)
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course';
  END;

  START TRANSACTION;
  INSERT INTO CourseInstructor(course_id, instructor_id, profit_percent)
  VALUES (course_id, instructor_id, profit_percent);
  INSERT INTO CourseInstructorHistory(course_id, instructor_id, course_profit_percent)
  VALUES (course_id, instructor_id, profit_percent);
  COMMIT;
END //

DELIMITER ;

CALL create_course_instructor(@course_id, 3, 50);

-- tạo học phần trong khoá học  
drop procedure create_course_section;
DELIMITER //

CREATE PROCEDURE create_course_section(
  IN input_course_id MEDIUMINT,
  IN title VARCHAR(60),
  OUT section_id SMALLINT
)
BEGIN
  DECLARE temp_section_id INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course';
  END;

  START TRANSACTION;

  SET temp_section_id = COALESCE(
    (SELECT MAX(id) + 1 FROM Section WHERE course_id = input_course_id),
    1
  );

  INSERT INTO Section(course_id, id, title) 
  VALUES (input_course_id, temp_section_id, title);

  INSERT INTO SectionOrder (section_id, course_id, order_section_id) 
  VALUES (temp_section_id, input_course_id, temp_section_id - 1);

  IF NOT EXISTS (SELECT 1 FROM CourseHighlight WHERE id = input_course_id) THEN
    CALL create_course_highlight(input_course_id);
  
  -- 9. Tổng số học phần trong một khoá học cho biết số học phần thuộc về khoá học đó. 
  UPDATE CourseHighlight 
  SET no_sections = no_sections + 1
  WHERE id = input_course_id;
  END IF;

  SET section_id = temp_section_id;

  COMMIT;
  SELECT * FROM Section;
END //

DELIMITER ;

-- -- tạo mục học trong học phần
DELIMITER //

CREATE PROCEDURE create_course_item (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN title VARCHAR(60),
  IN description VARCHAR(255),
  IN item_type ENUM('lecture', 'quiz'),
  OUT output_item_id SMALLINT
)
BEGIN
  DECLARE temp_item_id SMALLINT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course item';
  END;

  START TRANSACTION;
  SET temp_item_id = COALESCE(
    (
      SELECT MAX(id) + 1 
      FROM Item 
      WHERE course_id = input_course_id AND section_id = input_section_id
    ),
    1
  );

  INSERT INTO Item(id, section_id, course_id, title, description, item_type)
  VALUES (temp_item_id, input_section_id, input_course_id, title, description, item_type);

  INSERT INTO ItemOrder (item_id, section_id, course_id, order_item_id)
  VALUES (temp_item_id, input_section_id, input_course_id, temp_item_id - 1);

  UPDATE Section SET number_of_item = number_of_item + 1
  WHERE course_id = input_course_id AND id = input_section_id;

  SET output_item_id = temp_item_id;
  COMMIT;

  SELECT * FROM Item;
END //

DELIMITER ; 

-- tạo bài học trong mục học
DELIMITER //

CREATE PROCEDURE create_course_lecture (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN input_item_id SMALLINT,
  IN resource VARCHAR(2084),
  IN url VARCHAR(2084),
  In input_duration TIME
)
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the lecture';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM ITEM 
    WHERE id = input_item_id AND section_id = input_section_id AND course_id = input_course_id AND item_type = 'lecture') THEN
    ROLLBACK;
    SELECT 'Error: The item is not a lecture';
  END IF;

  START TRANSACTION;
  INSERT INTO Lecture(id, section_id, course_id, resource, url, duration)
  VALUES (input_item_id, input_section_id, input_course_id, resource, url, duration);

  UPDATE Section SET duration = ADDTIME(duration, input_duration)
  WHERE course_id = input_course_id AND id = input_section_id;
  COMMIT;

  SELECT * FROM Lecture;
END //

DELIMITER ;

-- tao phụ đề cho bài giảng
DELIMITER //

CREATE PROCEDURE create_course_lecture_subtitle (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN input_lecture_id SMALLINT,
  IN subtitle_language VARCHAR(255),
  IN subtitle VARCHAR(2084)
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the lecture subtitle';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM Lecture 
    WHERE id = input_lecture_id AND section_id = input_section_id AND course_id = input_course_id) THEN
    ROLLBACK;
    SELECT 'Error: The item is not a lecture';
  END IF;

  START TRANSACTION;
  INSERT INTO LectureSubtitle(lecture_id, section_id, course_id, subtitle_language, subtitle)
  VALUES (input_lecture_id, input_section_id, input_course_id, subtitle_language, subtitle);
  COMMIT;

  SELECT * FROM LectureSubtitle WHERE course_id = input_course_id;
END //

DELIMITER ;

-- CALL create_course_lecture_subtitle(12, 56, 1, 'en', 'subtitle');
-- CALL create_course_lecture_subtitle(12, 56, 1, 'fr', 'subtitle');

-- tạo bài kiểm tra
drop PROCEDURE create_course_quiz;
DELIMITER //

CREATE PROCEDURE create_course_quiz (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN input_item_id SMALLINT
)
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the quiz';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM Item 
    WHERE id = input_item_id AND section_id = input_section_id AND course_id = input_course_id AND item_type = 'quiz') THEN
    ROLLBACK;
    SELECT 'Error: The item is not a quiz';
  END IF;

  START TRANSACTION;
  INSERT INTO Quiz(id, section_id, course_id)
  VALUES (input_item_id, input_section_id, input_course_id);
  COMMIT;
END //

DELIMITER ;

CALL create_course_item(12, 56, 'title', 'description', 'quiz', @output_item_id);
CALL create_course_quiz(12, 56, @output_item_id);

-- tạo câu hỏi cho bài kiểm tra
DELIMITER //

CREATE PROCEDURE create_course_quizqa (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN input_quiz_id SMALLINT,
  IN question VARCHAR(600),
  OUT quiz_qa_id TINYINT
)
BEGIN 
  DECLARE temp_quiz_qa_id TINYINT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the quiz question';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM Quiz 
    WHERE id = input_quiz_id AND section_id = input_section_id AND course_id = input_course_id
  ) THEN 
    ROLLBACK;
    SELECT 'Error: The item is not a quiz';
  END IF;

  START TRANSACTION;
  SET temp_quiz_qa_id = COALESCE(
    (
      SELECT MAX(id) + 1 
      FROM QuizQA 
      WHERE course_id = input_course_id AND section_id = input_section_id 
        AND quiz_id = input_quiz_id
    ),
    1
  );

  INSERT INTO QuizQA(id, section_id, course_id, quiz_id, question)
  VALUES (temp_quiz_qa_id, input_section_id, input_course_id, input_quiz_id, question);

  SET quiz_qa_id = temp_quiz_qa_id;
  COMMIT;

  SELECT * FROM QuizQA;
END // 

DELIMITER ;

CALL create_course_quizqa(12, 56, 6,'123', @quiz_qa_id);
INSERT INTO QuizQA(id, section_id, course_id, quiz_id, question)
VALUES (2, 56, 12, 6, '123okok');
  SELECT * FROM Quiz;

-- tạo câu trả lời cho câu hỏi
DROP PROCEDURE create_course_quizqa_answer;
DELIMITER //

CREATE PROCEDURE create_course_quizqa_answer (
  IN input_course_id MEDIUMINT,
  IN input_section_id SMALLINT,
  IN input_quiz_id SMALLINT,
  IN answer VARCHAR(255),
  IN explanation VARCHAR(255),
  OUT answer_id SMALLINT
)
BEGIN
  DECLARE temp_answer_id SMALLINT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the quiz question answer';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM QuizQA 
    WHERE id = input_quiz_qa_id AND section_id = input_section_id 
      AND course_id = input_course_id AND quiz_id = input_quiz_id
  ) THEN
    ROLLBACK;
    SELECT 'Error: The quiz question does not exist';
  END IF;

  SET temp_answer_id = COALESCE(
    (
      SELECT MAX(id) + 1 
      FROM QuizQAAnswerDetail 
      WHERE course_id = input_course_id AND section_id = input_section_id AND quiz_id = input_quiz_id
    ),
    1
  );

  START TRANSACTION;
  INSERT INTO QuizQAAnswerDetail (id, quiz_id, section_id, course_id, answer, explanation)
  VALUES (temp_answer_id, input_quiz_id, input_section_id, input_course_id, answer, explanation);

  SET answer_id = temp_answer_id;
  COMMIT;
END //

DELIMITER ; 

-- CALL create_course_quizqa_answer(12, 56, 6, 'answer', 'explanation1', @answer_id);


-- tạo câu trả lời cho câu hỏi
DELIMITER //

CREATE PROCEDURE create_course_quizqa_answer_mapping(
  IN input_quiz_id SMALLINT,
  IN input_section_id SMALLINT,
  IN input_course_id MEDIUMINT,
  IN input_quiz_qa_id TINYINT,
  IN input_answer_detail_id TINYINT,
  IN is_correct BOOLEAN
)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the quiz question answer mapping';
  END;

  IF NOT EXISTS (
    SELECT 1 FROM QuizQA 
    WHERE id = input_quiz_qa_id AND section_id = input_section_id 
      AND course_id = input_course_id AND quiz_id = input_quiz_id
  ) THEN
    ROLLBACK;
    SELECT 'Error: The quiz question does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM QuizQAAnswerDetail 
    WHERE id = input_answer_detail_id AND quiz_id = input_quiz_id 
      AND section_id = input_section_id AND course_id = input_course_id
  ) THEN
    ROLLBACK;
    SELECT 'Error: The quiz question answer does not exist';
  END IF;

  START TRANSACTION;
  INSERT INTO QuizQAAnswerMapping(quiz_id, section_id, course_id, quiz_qa_id, answer_detail_id, isCorrectAnswer)
  VALUES (input_quiz_id, input_section_id, input_course_id, input_quiz_qa_id, input_answer_detail_id, is_correct);
  COMMIT;
END //

DELIMITER ;

CALL create_course_quizqa_answer_mapping(6, 56, 12, 1, 2, 1);

-- Truy vấn: (8) Cho biết danh sách các khoá học mà học viên đã đăng ký.
DELIMITER //

CREATE PROCEDURE get_courses_enrolled_by_learner_id(IN learner_id MEDIUMINT)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  START TRANSACTION;
  SELECT c.id, c.title, c.subtitle, sc.name AS subcategory_name, ch.students_enrolled, 
         ch.average_rating, ch.sale_price, u.full_name AS instructor_name
  FROM EnrollementCourse ec
  JOIN Course c ON ec.course_id = c.id
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci on ci.course_id = c.id
  JOIN User u on u.id = ci.instructor_id 
  WHERE ec.learner_id = learner_id
    AND (u.role = 'instructor' or u.role = 'vipinstrutor');
  COMMIT;
END //

DELIMITER ;

CALL get_courses_enrolled_by_learner_id(5);


-- Truy vấn: (9) Cho biết thông tin chi tiết của một khoá học.
DELIMITER //

CREATE PROCEDURE view_course_details(IN input_course_id MEDIUMINT)
BEGIN 
  SELECT
    c.id AS course_id,
    c.title AS course_title,
    c.subtitle AS course_subtitle,
    c.description AS course_description,
    c.language AS course_language,
    c.requirement AS course_requirement,
    c.image AS course_image,
    c.tier_id AS course_tier_id,
    c.status AS course_status,
    c.subcategory_id AS course_subcategory_id,
    co.course_objective AS course_objective,
    sc.name AS subcategory_name,
    t.price AS tier_price,
    i.instructor_id AS instructor_id,
    i.date_of_birth AS instructor_date_of_birth,
    i.address AS instructor_address,
    i.phone AS instructor_phone,
    i.academic_degree AS instructor_academic_degree,
    i.working_unit AS instructor_working_unit,
    i.academic_title AS instructor_academic_title,
    i.description AS instructor_description,
    i.instructor_type AS instructor_type,
    cih.create_at AS instructor_history_create_at,
    cih.course_profit_percent AS course_profit_percent,
    cp.section_id AS course_section_id,
    cp.item_id AS course_item_id,
    cp.learner_id AS course_learner_id,
    ch.downloadable_documents AS course_downloadable_documents,
    ch.students_enrolled AS course_students_enrolled,
    ch.average_rating AS course_average_rating,
    ch.sale_price AS course_sale_price,
    ch.no_sections AS course_no_sections,
    ch.duration AS course_duration,
    pp.name AS promotional_program_name,
    pp.content AS promotional_program_content,
    pp.day_start AS promotional_program_day_start,
    pp.day_end AS promotional_program_day_end,
    pp.repeating_type AS promotional_program_repeating_type,
    pp.tier_difference AS promotional_program_tier_difference
  FROM
      Course c
  LEFT JOIN
      CourseObjective co ON c.id = co.course_id
  LEFT JOIN
      SubCategory sc ON c.subcategory_id = sc.id
  LEFT JOIN
      Tier t ON c.tier_id = t.id
  LEFT JOIN
      CourseInstructor ci ON c.id = ci.course_id
  LEFT JOIN
      Instructor i ON ci.instructor_id = i.instructor_id
  LEFT JOIN
      CourseInstructorHistory cih ON c.id = cih.course_id AND ci.instructor_id = cih.instructor_id
  LEFT JOIN
      CourseProgress cp ON c.id = cp.course_id
  LEFT JOIN
      CourseHighlight ch ON c.id = ch.id
  LEFT JOIN
      PromotionalProgram pp ON c.id = pp.id
  WHERE
      c.id = input_course_id;

END

DELIMITER ;

CALL view_course_details(1);

-- Truy vấn: (10) Xem đánh giá, nhận xét trong một khoá học.
DELIMITER // 

CREATE PROCEDURE view_course_reviews(IN input_course_id MEDIUMINT)
BEGIN 
  SELECT
      ec.course_id,
      ec.learner_id,
      ec.course_rating,
      ec.course_comment,
      c.title AS course_title,
      u.full_name AS learner_name
  FROM EnrollementCourse ec
  JOIN Course c ON ec.course_id = c.id
  JOIN Learner l ON ec.learner_id = l.learner_id
  JOIN User u ON l.learner_id = u.id
  WHERE ec.course_id = input_course_id;
END //

DELIMITER ;

CALL view_course_reviews(6);

-- Truy vấn: (11) Xem danh cách các khoá học đang chờ duyệt để đăng trên hệ thống.  
DELIMITER //

CREATE PROCEDURE view_courses_pending_approval()
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;
  SELECT c.id AS course_id, c.title, c.subtitle, c.description, c.language, c.requirement, c.image, c.status
  FROM Course c
  JOIN CourseInstructor ci ON c.id = ci.course_id
    AND c.status = 'pending';
END //

DELIMITER ; 

CALL view_courses_pending_approval();

-- Truy vấn: (12) Xem chi tiết khóa học đang chờ duyệt để đăng trên hệ thống.
DELIMITER //

CREATE PROCEDURE view_course_details_pending_approval(IN input_course_id MEDIUMINT) 
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  START TRANSACTION;

  SELECT 
    c.id AS course_id,
    c.title AS course_title,
    c.subtitle AS course_subtitle,
    c.description AS course_description,
    c.language AS course_language,
    c.requirement AS course_requirement,
    c.image AS course_image,
    c.tier_id AS tier_id,
    c.status AS course_status,
    co.course_objective AS course_objective,
    sc.name AS subcategory_name,
    t.price AS tier_price,
    i.date_of_birth AS instructor_date_of_birth,
    i.address AS instructor_address,
    i.phone AS instructor_phone,
    i.academic_degree AS instructor_academic_degree,
    i.working_unit AS instructor_working_unit,
    i.academic_title AS instructor_academic_title,
    i.description AS instructor_description,
    i.instructor_type AS instructor_type,
    ch.downloadable_documents AS downloadable_documents,
    ch.no_sections AS number_of_sections,
    ch.duration AS course_duration,
    u.full_name
  FROM 
      Course c
      JOIN CourseObjective co ON c.id = co.course_id
      JOIN SubCategory sc ON c.subcategory_id = sc.id
      JOIN Tier t ON c.tier_id = t.id
      JOIN CourseHighlight ch ON c.id = ch.id
      JOIN CourseInstructorHistory cih ON c.id = cih.course_id
      JOIN Instructor i ON cih.instructor_id = i.instructor_id
      JOIN User u on u.id = i.instructor_id
  WHERE c.status = 'pending' AND c.id = input_course_id;
  
  COMMIT;
END //

DELIMITER ; 

CALL view_course_details_pending_approval(6);

--  Truy vấn: (13) Xem doanh thu của giảng viên.
DELIMITER //

CREATE PROCEDURE get_instructor_revenue(IN instructor_id MEDIUMINT)
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the revenue';
  END;

  START TRANSACTION;

  delete from MonthlyCourseIncomeVipInstructor where course_id > 0;
  delete from MonthlyCourseIncome where course_id > 0;

  INSERT INTO MonthlyCourseIncome (course_id, date, final_amount)
  SELECT 
    ec.course_id, 
    DATE_FORMAT(p.date, '%Y-%m-07') AS date,
    SUM(ec.final_course_price) AS final_amount
  FROM EnrollementCourse ec 
  JOIN Payment p ON ec.payment_id = p.id
  GROUP BY ec.course_id, DATE_FORMAT(p.date, '%Y-%m-07')
  ON DUPLICATE KEY UPDATE final_amount = VALUES(final_amount);

  INSERT INTO MonthlyCourseIncomeVipInstructor(course_id, date, vip_instructor_id, revenue)
  SELECT 
    mc.course_id, mc.date, ci.instructor_id, mc.final_amount * ci.profit_percent / 100 as revenue
  FROM MonthlyCourseIncome mc 
  JOIN CourseInstructor ci on mc.course_id = ci.course_id
  JOIN VipInstructor vip on ci.instructor_id = vip.vip_instructor_id;

  COMMIT;

  SELECT * FROM MonthlyCourseIncomeVipInstructor WHERE vip_instructor_id = instructor_id;
END //

DELIMITER ;

CALL get_instructor_revenue(2);

-- Truy vấn: (14) Xét duyệt khóa học đang chờ.
DELIMITER //

CREATE PROCEDURE approve_course(IN input_course_id MEDIUMINT, IN input_status ENUM('approved', 'rejected'))
BEGIN 
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while approving the course';
  END;

  START TRANSACTION;
  UPDATE Course SET status = input_status WHERE id = input_course_id;
  COMMIT;
END //
DELIMITER ;

CALL approve_course(1, 'approved');

