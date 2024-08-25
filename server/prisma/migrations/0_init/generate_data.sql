use defaultdb;
select * from PromotionalProgram;

drop PROCEDURE generate_data_on_promotion_program;
DELIMITER //

CREATE PROCEDURE generate_data_on_promotion_program() 
BEGIN 
  DECLARE i INT DEFAULT 1000;
  DECLARE start_date DATE DEFAULT '2024-04-23';
  DECLARE end_date DATE;

  WHILE i <= 1500 DO
    SET end_date = DATE_ADD(start_date, INTERVAL 3 DAY);
    INSERT INTO PromotionalProgram (id, name, content, day_start, day_end, tier_difference)
    VALUES (
	  i,
      CONCAT('Program ', i),
      CONCAT('Content for program ', i),
      start_date,
      end_date,
      FLOOR(RAND() * 3) + 1
    );
    SET start_date = DATE_ADD(end_date, INTERVAL 1 DAY);
    SET i = i + 1;
  END WHILE;
  
  select * from PromotionalProgram where id >= 1000;
END //

DELIMITER ;

delete from PromotionalProgram where id >= 1000;
select * from PromotionalProgram where id >= 1000;
CALL generate_data_on_promotion_program();

-- generate data on Tier
INSERT INTO Tier (price) VALUES (399000);  -- Thang 1
INSERT INTO Tier (price) VALUES (449000);  -- Thang 2
INSERT INTO Tier (price) VALUES (499000);  -- Thang 3
INSERT INTO Tier (price) VALUES (549000);  -- Thang 4
INSERT INTO Tier (price) VALUES (599000);  -- Thang 5
INSERT INTO Tier (price) VALUES (649000);  -- Thang 6
INSERT INTO Tier (price) VALUES (699000);  -- Thang 7
INSERT INTO Tier (price) VALUES (749000);  -- Thang 8
INSERT INTO Tier (price) VALUES (799000);  -- Thang 9
INSERT INTO Tier (price) VALUES (849000);  -- Thang 10
INSERT INTO Tier (price) VALUES (899000);  -- Thang 11
INSERT INTO Tier (price) VALUES (949000);  -- Thang 12
INSERT INTO Tier (price) VALUES (999000);  -- Thang 13
INSERT INTO Tier (price) VALUES (1099000); -- Thang 14
INSERT INTO Tier (price) VALUES (1149000); -- Thang 15
INSERT INTO Tier (price) VALUES (1199000); -- Thang 16
INSERT INTO Tier (price) VALUES (1249000); -- Thang 17
INSERT INTO Tier (price) VALUES (1299000); -- Thang 18
INSERT INTO Tier (price) VALUES (1349000); -- Thang 19
INSERT INTO Tier (price) VALUES (1399000); -- Thang 20
INSERT INTO Tier (price) VALUES (1499000); -- Thang 21
INSERT INTO Tier (price) VALUES (1599000); -- Thang 22
INSERT INTO Tier (price) VALUES (1699000); -- Thang 23
INSERT INTO Tier (price) VALUES (1799000); -- Thang 24
INSERT INTO Tier (price) VALUES (1899000); -- Thang 25
INSERT INTO Tier (price) VALUES (2199000); -- Thang 26
INSERT INTO Tier (price) VALUES (2399000); -- Thang 27
INSERT INTO Tier (price) VALUES (2499000); -- Thang 28

select * from SubCategory;

-- generate data on Course 
drop PROCEDURE generate_data_on_course;
DELIMITER //

CREATE PROCEDURE generate_data_on_course()
BEGIN
    DECLARE i MEDIUMINT DEFAULT 1;
    DECLARE tier_id MEDIUMINT DEFAULT 1;
    DECLARE subcategory_id TINYINT DEFAULT 1;
    
    WHILE i <= 100000 DO
        -- Set tier_id using modulo to cycle through tier values
        SET tier_id = i % 28 + 1;

        -- Set subcategory_id using modulo to cycle through subcategories
        SET subcategory_id = i % 100 + 1;

        -- Insert into Course table without specifying id (let AUTO_INCREMENT handle it)
        INSERT INTO Course (title, subtitle, description, language, requirement, image, tier_id, status, subcategory_id)
        VALUES (
            CONCAT('Course Title ', i),
            CONCAT('Course Subtitle ', i),
            CONCAT('Course Description ', i),
            IF(i % 2 = 0, 'en', 'vi'),
            CONCAT('Course Requirement ', i),
            'https://picsum.photos/200/300',
            tier_id,
            IF(i % 10 = 0, 'approved', 'pending'),
            subcategory_id
        );

        SET i = i + 1;
    END WHILE;

    SELECT * FROM Course;
END //

DELIMITER ;


CALL generate_data_on_course();

-- generate data on CourseHighlight
DELIMITER //

CREATE PROCEDURE generate_data_on_course_highlight()
BEGIN 
  DECLARE i INT DEFAULT 1;
  DECLARE totalCourses MEDIUMINT;
  SET totalCourses = (SELECT COUNT(*) FROM Course);

  WHILE i <= totalCourses DO 
    INSERT INTO CourseHighlight (id)
    VALUES (i);
    SET i = i + 1;      
  END WHILE;

  SELECT * FROM CourseHighlight;
END //

DELIMITER ;
  SELECT * FROM Course;

CALL generate_data_on_course_highlight();


-- generate data on Section 
drop PROCEDURE generate_data_on_section;
DELIMITER //

CREATE PROCEDURE generate_data_on_section()
BEGIN
  DECLARE totalCourses MEDIUMINT;
  DECLARE i INT DEFAULT 1;
  DECLARE j INT DEFAULT 1;


  WHILE i <= 5000 DO
    WHILE j <= 5 DO
      INSERT INTO Section (id, course_id, title)
      VALUES (
        j, i, CONCAT('Section ', j)
      );
      SET j = j + 1;
    END WHILE;
    SET j = 1;
    SET i = i + 1;
  END WHILE;
END //

DELIMITER ;

CALL generate_data_on_section();
-- generate data on SectionOrder
drop PROCEDURE generate_data_on_section_order;
DELIMITER // 

CREATE PROCEDURE generate_data_on_section_order()
BEGIN 
  DECLARE i INT DEFAULT 1;
  DECLARE j INT DEFAULT 1;

  WHILE i <= 5000 DO
    WHILE j <= 5 DO
      INSERT INTO SectionOrder (course_id, section_id, order_section_id)
      VALUES (i, j, j - 1);
      SET j = j + 1;
    END WHILE;
    SET j = 1;
    SET i = i + 1;
  END WHILE;

  SELECT * FROM SectionOrder;
END // 

DELIMITER ;

CALL generate_data_on_section_order();

-- generate data on Item
drop PROCEDURE generate_data_on_item;
DELIMITER //

CREATE PROCEDURE generate_data_on_item()

BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE j INT DEFAULT 1;
  DECLARE k INT DEFAULT 1;
  DECLARE item_type ENUM ('lecture', 'quiz');

  WHILE i <= 5000 DO
    WHILE j <= 5 DO
      WHILE k <= 10 DO
        SET item_type = IF(k % 10 = 0, 'quiz', 'lecture');
        INSERT INTO Item (id, section_id, course_id, title, description, item_type)
        VALUES (k, j, i, CONCAT('Item ', k), CONCAT('Description for item ', k), item_type);
        SET k = k + 1;
      END WHILE;
      SET k = 1;
      SET j = j + 1;
    END WHILE;
    SET j = 1;
    SET i = i + 1;
  END WHILE;

  SELECT * FROM Course c JOIN Section s ON c.id = s.course_id JOIN Item i ON s.id = i.section_id;
END //

DELIMITER ;

CALL generate_data_on_item();


-- table CourseObjective 
DROP PROCEDURE generate_data_on_course_objective;
DELIMITER // 

CREATE PROCEDURE generate_data_on_course_objective() 
BEGIN 
  DECLARE i INT DEFAULT 1;
  DECLARE j INT DEFAULT 1;
  
  WHILE i <= 10000 DO 
    WHILE j <= 3 DO 
      INSERT INTO CourseObjective (course_id, course_objective)
      VALUES (i, CONCAT('Objective ', j));
      SET j = j + 1;
    END WHILE;
    SET j = 1;
    SET i = i + 1;
  END WHILE;  

  SELECT * FROM CourseObjective;
END //

DELIMITER ;

CALL generate_data_on_course_objective();
  SELECT * FROM CourseObjective where course_id > 9000;


-- update datatable CourseHighlight sale_price 


-- -----------------------------------------------------------------------
DROP PROCEDURE IF EXISTS create_payment_and_enroll;
DROP PROCEDURE IF EXISTS loop_through_learners;

DELIMITER //

CREATE PROCEDURE create_payment_and_enroll(IN inp_learner_id MEDIUMINT)
BEGIN
  DECLARE total_courses INT;
  DECLARE payment_id INT;
  DECLARE half_courses INT;
  DECLARE i INT DEFAULT 1;
  DECLARE finalPriceCourse MEDIUMINT; 
  DECLARE c_id MEDIUMINT;

  START TRANSACTION;

  IF NOT EXISTS (SELECT 1 FROM ShoppingCart WHERE learner_id = inp_learner_id) THEN 
    ROLLBACK;
    SET payment_id = NULL;
    SELECT 'Error: The course is not in the cart' AS error_message;
  ELSE
    INSERT INTO Payment (learner_id) VALUES (inp_learner_id);
    SET payment_id = LAST_INSERT_ID(); 
    COMMIT;
  END IF;

  SET total_courses = (SELECT COUNT(*) FROM ShoppingCart WHERE learner_id = inp_learner_id);
  SET half_courses = FLOOR(total_courses / 2);
  
  WHILE i <= half_courses DO 
    SELECT course_id INTO c_id FROM ShoppingCart WHERE learner_id = inp_learner_id LIMIT 1;
    CALL update_sale_price_course_highlight(c_id);
    SELECT sale_price INTO finalPriceCourse FROM CourseHighlight WHERE id = c_id;

    INSERT INTO EnrollementCourse (learner_id, course_id, payment_id, final_course_price)
    VALUES (inp_learner_id, c_id, payment_id, finalPriceCourse);

    DELETE FROM ShoppingCart WHERE learner_id = inp_learner_id AND course_id = c_id;

    UPDATE Payment
    SET total_price = total_price + finalPriceCourse,
        total_course = total_course + 1
    WHERE id = payment_id;

    SET i = i + 1;
    
  END WHILE;
  COMMIT;
END //

DELIMITER ;


-- Define the delimiter for procedure creation
drop PROCEDURE loop_through_learners;
DELIMITER //

CREATE PROCEDURE loop_through_learners(max_id INT)
BEGIN
  DECLARE i INT DEFAULT 20502;
  
  -- Loop from 1 to max_id
  WHILE i <= max_id DO
    -- Call the procedure with the current learner_id
    CALL create_payment_and_enroll(i);
    
    -- Increment the learner_id
    SET i = i + 1;
  END WHILE;
END //

-- Reset delimiter
DELIMITER ;

CALL loop_through_learners (20700);
delete from Payment where id < 1000;
alter table Payment auto_increment = 1;
select * from Payment p join EnrollementCourse e on p.id = e.payment_id where course_id = 1 and learner_id = 26243;
select * from ShoppingCart order by learner_id;
select * from Learner order by learner_id desc;
select * from CourseInstructor where course_id = 1;

select * from MonthlyCourseIncome;
select * from MonthlyCourseIncomeVipInstructor;

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
