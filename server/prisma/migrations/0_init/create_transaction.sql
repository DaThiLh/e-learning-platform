-- use mysql;
use defaultdb;

--Truy vấn 1: Xem các khóa học đã tạo .
DELIMITER //

CREATE PROCEDURE get_courses_by_instructor_id(IN instructor_id INT)
BEGIN
  -- Check if instructor exists: I checked on the FE
  -- Retrieve course details
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  START TRANSACTION;
  SELECT c.id, c.title, sc.name AS subcategory_name, ch.students_enrolled, 
         ch.average_rating, ch.sale_price
  FROM Course c
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci ON c.id = ci.course_id AND ci.instructor_id = instructor_id;
  COMMIT;
END //              

DELIMITER ;

-- Truy vấn: (3) Cho biết thông tin danh sách khoá học dựa vào từ khoá tìm kiếm theo tên khoá học.
DELIMITER //

CREATE PROCEDURE search_courses_by_keyword(IN keyword VARCHAR(60))
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  START TRANSACTION;
  SELECT c.id, c.title, sc.name AS subcategory_name, ch.students_enrolled, 
         ch.average_rating, ch.sale_price, u.full_name AS instructor_name
  FROM Course c
  JOIN SubCategory sc ON c.subcategory_id = sc.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN CourseInstructor ci on ci.course_id = c.id
  JOIN User u on u.id = ci.instructor_id 
  WHERE c.title LIKE CONCAT('%', keyword COLLATE utf8mb4_unicode_ci, '%')
    AND (u.role = 'instructor' or u.role = 'vipinstrutor')
    AND c.status = 'approved';
  COMMIT;
END //

DELIMITER ;

-- Truy vấn: (4) Cho biết danh sách các khoá học mà học viên có thể xem được.
DELIMITER //

CREATE PROCEDURE get_courses_for_student()
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses';
  END;

  START TRANSACTION;
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

-- Truy vấn: (6) Cho biết các danh sách khoá học có trong giỏ hàng của học viên.
DELIMITER //

CREATE PROCEDURE get_courses_in_cart(IN learner_id MEDIUMINT)
BEGIN
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while retrieving the courses in the cart' AS error_message;
  END;

  START TRANSACTION;
  SELECT c.id, c.title, scat.name AS subcategory_name, u.full_name AS instructor_name, 
          ch.students_enrolled, ch.average_rating, ch.sale_price AS sale_price, t.price AS original_price
  FROM ShoppingCart sc 
  JOIN Course c ON sc.course_id = c.id
  JOIN SubCategory scat ON c.subcategory_id = scat.id
  JOIN CourseInstructor ci ON ci.course_id = c.id
  JOIN User u ON ci.instructor_id = u.id
  JOIN CourseHighlight ch ON c.id = ch.id
  JOIN Tier t on c.tier_id = t.id
  WHERE sc.learner_id = 5
    AND u.role = 'instructor' OR u.role = 'vipinstrutor';
  COMMIT;
END //

DELIMITER;

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

-- Tạo khóa học mới 
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

  SELECT * FROM CourseInstructor WHERE course_id = course_id;
  COMMIT;
END //

DELIMITER ;

CALL create_course_instructor(@course_id, 3, 50);

-- tạo học phần trong khoá học  
DELIMITER //

CREATE PROCEDURE create_course_section(
  IN course_id MEDIUMINT,
  IN title VARCHAR(60),
  OUT section_id SMALLINT
)
BEGIN
  DECLARE section_id INT;
  DECLARE order_section_id INT;

  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN 
    ROLLBACK;
    SELECT 'Error: An error occurred while creating the course';
  END;

  SET section_id = COALESCE(
    (SELECT MAX(section_id) + 1 FROM section WHERE course_id = course_id),
    1
  );
    
  START TRANSACTION;
  INSERT INTO Section(course_id, id, title) VALUES (course_id, section_id, title);

  SET section_id = LAST_INSERT_ID();

  SET order_section_id = COALESCE(
    (SELECT MAX(order_section_id) + 1 FROM SectionOrder WHERE course_id = course_id),
    0
  );

  INSERT INTO SectionOrder (section_id, course_id, order_section_id)
  VALUES (section_id, course_id, order_section_id);

  UPDATE CourseHighlight 
  SET sections = sections + 1
  WHERE id = course_id;
  COMMIT;
END //

DELIMITER ;

CALL create_course_section(@course_id, 'title', @section_id);

-- -- tạo mục học trong học phần
-- DELIMITER //

-- CREATE PROCEDURE create_course_section_item(
--   IN course_id MEDIUMINT,
--   IN section_id SMALLINT,
--   IN title VARCHAR(80),
--   IN description VARCHAR(255),
--   IN item_type ENUM('lecture', 'quiz')
-- )
-- BEGIN 
--   DECLARE CONTINUE HANDLER FOR SQLEXCEPTION;
--   BEGIN 
--     ROLLBACK;
--     SELECT 'Error: An error occurred while creating the course';
--   END;  

--   START TRANSACTION;
--   DECLARE item_id INT;
--   if not exists (select 1 from Item where course_id = course_id and section_id = section_id)
--   then 
--     SET item_id = 1;
--   else 
--     SET item_id = (select max(item_id) + 1 from Item where course_id = course_id and section_id = section_id);
--   end if;
--   INSERT INTO Item(id, section_id, course_id, title, description, item_type)
--   VALUES (item_id, section_id, course_id, title, description, item_type);

--   DECLARE order_item_id INT;
--   if not exists (select 1 from ItemOrder where course_id = course_id and section_id = section_id)
--   then 
--     SET order_item_id = 1;
--   else 
--     SET order_item_id = (select max(order_item_id) + 1 from ItemOrder where course_id = course_id and section_id = section_id);
--   end if;
--   INSERT INTO ItemOrder (item_id, section_id, course_id, order_item_id) 
--   VALUES (item_id, section_id, course_id, order_item_id);
--   COMMIT;`
-- END

-- DELIMITER ;