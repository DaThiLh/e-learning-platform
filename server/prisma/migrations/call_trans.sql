use defaultdb;

-- truy vấn 3: Cho biết thông tin danh sách khoá học dựa vào từ khoá tìm kiếm theo tên khoá học.
DROP PROCEDURE IF EXISTS create_enrollment_course;
CALL search_courses_by_keyword('96cqpmjhB6');
CALL search_courses_by_keyword('9');

CALL get_courses_for_student();

-- Truy vấn: (5) Thêm khóa học vào giỏ hàng.
CALL add_course_to_cart(5, 3);

SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE Payment ADD COLUMN Learner_id MEDIUMINT UNSIGNED NOT NULL, 
ADD CONSTRAINT FK_Payment_Learner FOREIGN KEY (Learner_id) 
REFERENCES Learner (learner_id);

SET FOREIGN_KEY_CHECKS=1;

-- Truy vấn: (7) Thanh toán khoá học.
SET @payment_id = 20;
CALL create_payment(5, @payment_id);
SELECT @payment_id AS payment_id;

INSERT INTO Payment (learner_id) VALUES (5);

SET @payment_id = LAST_INSERT_ID(); 
SELECT @payment_id AS payment_id;

SET @payment_id = 11;

Call create_enrollment_course(5, 5, @payment_id);
delete from EnrollementCourse where learner_id = 5;

SET @final_price = (SELECT sale_price FROM CourseHighlight WHERE id = 3);
INSERT INTO EnrollementCourse(learner_id, course_id, payment_id, final_course_price)
  VALUES (5, 4, 11, @final_price);


