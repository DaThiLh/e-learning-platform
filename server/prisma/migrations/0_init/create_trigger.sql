use defaultdb;

-- 7. Mỗi chương trình khuyến mãi đều lưu lại lịch sử. 
-- Ngày chỉnh sửa chương trình khuyến mãi phải nhỏ hơn hoặc bằng ngày hết chương trình khuyến mãi.
DELIMITER //

CREATE TRIGGER before_insert_promotion_program
BEFORE INSERT ON PromotionalProgram
FOR EACH ROW
BEGIN
    IF NEW.day_start > NEW.day_end THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The start date of the promotional program must be less than or equal to the end date of the promotional program.';
    END IF;
END //

DELIMITER ;

INSERT INTO PromotionalProgram (id, name, content, day_start, day_end, repeating_type, tier_difference) 
VALUES (1, 'hihi', 'abc', '2020-12-12', '2020-10-10', 'weekly', 1);

-- 20. Mỗi học viên chỉ được tham gia mỗi bài quiz tối đa 1 lần. 
DELIMITER //

CREATE TRIGGER before_insert_participate_quiz
BEFORE INSERT ON StudentAnswerQA
FOR EACH ROW
BEGIN
	IF EXISTS (
		SELECT 1 FROM StudentAnswerQA 
        WHERE quiz_id = NEW.quiz_id 
			AND section_id = NEW.section_id 
            AND course_id = NEW.course_id 
            AND quiz_qa_id = NEW.quiz_qa_id 
            AND answer_detail_id = NEW.answer_detail_id
	) THEN 
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Each student can only participate in each quiz once.';
	END IF;
END //

DELIMITER ;

-- 22. Mỗi khóa học chỉ được có tối đa 1400 mục giáo trình bao gồm học phần, bài giảng, và quiz. (Section + CourseHighlint< 1400
-- drop procedure if exists CheckItemLimit;
-- drop trigger if exists before_insert_section;
-- drop trigger if exists before_insert_item;
DELIMITER //

CREATE PROCEDURE CheckItemLimit(IN course_id MEDIUMINT)
BEGIN 
    DECLARE total_sections INT;
    DECLARE total_items INT;

	SELECT no_sections INTO total_sections  FROM CourseHighlight WHERE id = course_id;
  SELECT IFNULL(SUM(number_of_item), 0) INTO total_items FROM Section WHERE course_id = course_id;

  IF (total_sections + total_items + 1 > 1400) THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Only up to 1400 items (sections and quizzes) are allowed per course.';
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_insert_section
BEFORE INSERT ON Section 
FOR EACH ROW     
BEGIN
	CALL CheckItemLimit(NEW.course_id);
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_insert_item
BEFORE INSERT ON Item 
FOR EACH ROW     
BEGIN
	CALL CheckItemLimit(NEW.course_id);
END //

DELIMITER ;

-- 23. Khi giảng viên cao cấp tạo một khóa học tính phí, 
-- họ có thể thêm giảng viên cao cấp hoặc giảng viên thường khác vào để trở thành đồng tác giả.  
-- 24. Khi giảng viên thường được thêm vào một khóa học có tính phí, họ sẽ mặc định được chia lợi nhuận 0%. 

DELIMITER //

CREATE TRIGGER before_insert_instructor_into_course
BEFORE INSERT ON CourseInstructor
FOR EACH ROW 
BEGIN
	DECLARE owner INT;
    
    SELECT instructor_id 
    INTO owner
    FROM CourseInstructorHistory 
    WHERE course_id = NEW.course_id
    ORDER BY create_at DESC
    LIMIT 1;
    
	IF NOT EXISTS (SELECT 1 FROM VipInstructor where vip_instructor_id = owner)
    THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The specified instructor is not a VIP instructor.';
	ELSE 
		IF EXISTS (SELECT 1 FROM Instructor WHERE instructor_id = NEW.instructor_id AND instructor_type = 'instructor') 
			AND NEW.profit_percent != 0
        THEN 
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'The instructor must have profit percent = 0.';
		END IF;
	END IF;
END //

DELIMITER ;
