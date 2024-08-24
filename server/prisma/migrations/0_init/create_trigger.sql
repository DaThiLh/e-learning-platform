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
drop  PROCEDURE CheckItemLimit;
DELIMITER //

CREATE PROCEDURE CheckItemLimit(IN course_id MEDIUMINT)
BEGIN 
    DECLARE total_sections INT;
    DECLARE total_items INT;

	SELECT IFNULL(no_sections, 0) INTO total_sections  FROM CourseHighlight WHERE id = course_id;
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
    DECLARE latest_instructor_id INT;
    DECLARE is_vip_instructor INT;

    -- Get the most recent instructor for the course
    SELECT instructor_id 
    INTO latest_instructor_id
    FROM CourseInstructorHistory 
    WHERE course_id = NEW.course_id
    ORDER BY create_at DESC
    LIMIT 1;

    IF latest_instructor_id IS NOT NULL THEN 
        -- Check if the last instructor was a VIP instructor
        SELECT COUNT(*) INTO is_vip_instructor
        FROM VipInstructor 
        WHERE vip_instructor_id = latest_instructor_id;

        IF is_vip_instructor = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The last instructor was not a VIP instructor.';
        ELSE
            -- Check if the new instructor has profit_percent not equal to 0
            IF EXISTS (SELECT 1 FROM Instructor 
                       WHERE instructor_id = NEW.instructor_id 
                       AND instructor_type = 'instructor')
            AND NEW.profit_percent != 0 THEN 
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The instructor must have profit percent = 0.';
            END IF;
        END IF;
    END IF;
END //

DELIMITER ;



-- 6. Số học viên tham gia khoá học phải bằng tổng số học viên đã đăng ký khoá học từ lúc khoá được tạo đến thời điểm đó. 
DELIMITER //

CREATE TRIGGER increment_students_enrolled
AFTER INSERT ON EnrollementCourse
FOR EACH ROW
BEGIN
    UPDATE CourseHighlight
    SET students_enrolled = students_enrolled + 1
    WHERE id = NEW.course_id;
END //

DELIMITER ;

-- 8. Tổng số mục trong một học phần cho biết số mục thực sự thuộc về học phần đó.  
DELIMITER //

CREATE TRIGGER increment_NumberOfItem_after_insert
AFTER INSERT ON Item
FOR EACH ROW
BEGIN
    UPDATE Section
    SET number_of_item = number_of_item + 1
    WHERE id = NEW.section_id and course_id = NEW.course_id;
END //

DELIMITER ;

-- 10.  Tổng thời gian trong một khoá học cho biết tổng thời lượng của các học phần trong khoá học đó 
DELIMITER //

CREATE TRIGGER update_section_duration
AFTER INSERT ON Lecture
FOR EACH ROW
BEGIN
    UPDATE Section
    SET duration = ADDTIME(duration, NEW.duration)
    WHERE id = NEW.section_id and course_id = NEW.course_id;
END //

DELIMITER ;

-- 12. Tổng thời gian trong một khoá học cho biết tổng thời lượng của các học phần trong khoá học đó.  (Course Highlignh -> section) 
DELIMITER //

CREATE TRIGGER update_courseHighlight_duration
AFTER INSERT ON Section
FOR EACH ROW
BEGIN
    -- Update CourseHighlight by adding LectureDuration
    UPDATE CourseHighlight
    SET duration = duration + NEW.duration
    WHERE id = NEW.course_id;
END //

DELIMITER ;

-- 22. Mỗi khóa học chỉ được có tối đa 1400 mục giáo trình bao gồm học phần, bài giảng, và quiz. (Section + CourseHighlint< 1400)
DELIMITER //

CREATE TRIGGER check_max_items
BEFORE INSERT ON Section
FOR EACH ROW
BEGIN
    DECLARE total_items INT;

    -- Calculate the total number of items
    SELECT CH.no_sections + (NEW.number_of_item * CH.no_sections)
    INTO total_items
    FROM CourseHighlight CH
    WHERE CH.id = NEW.course_id;

    -- Check if the total exceeds the limit
    IF total_items > 1400 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Exceeded maximum number of items (1400) for this course.';
    END IF;
END //

DELIMITER ;

-- 17. Một quiz có tối đa 20 câu hỏi, 1 câu hỏi tối đa 15 đáp án, có thể chọn nhiều đáp án đúng. Số đáp án đúng phải ít hơn hoặc bằng số đáp án. 
DELIMITER //

CREATE TRIGGER limit_quizqa_detail_count
BEFORE INSERT ON QuizQAAnswerMapping
FOR EACH ROW
BEGIN
    -- Kiểm tra số lượng QuizQ&ADetailID hiện tại của QuizQ&AID
    DECLARE detail_count INT;
    SET detail_count = (
        SELECT COUNT(*)
        FROM QuizQAAnswerMapping
        WHERE quiz_qa_id = NEW.quiz_qa_id
          AND quiz_id = NEW.quiz_id
          AND section_id = NEW.section_id
          AND course_id = NEW.course_id
    );
    
    -- Nếu số lượng QuizQ&ADetailID >= 15, không cho phép insert thêm
    IF detail_count >= 15 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert more than 15 QuizQ&ADetailID for the same QuizQ&AID.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER limit_quizqa_inserts
BEFORE INSERT ON QuizQA
FOR EACH ROW
BEGIN
    -- Declare a variable to hold the count
    DECLARE quizqa_count INT;

    -- Get the current count of records with the same quiz_id, section_id, and course_id
    SELECT COUNT(*)
    INTO quizqa_count
    FROM QuizQA
    WHERE quiz_id = NEW.quiz_id
    AND section_id = NEW.section_id
    AND course_id = NEW.course_id;

    -- Check if the count exceeds 14 (as we are inserting one more)
    IF quizqa_count >= 15 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert more than 15 QuizQA entries for a given quiz_id, section_id, and course_id.';
    END IF;
END //

DELIMITER ;

-- 2. Giá khoá học học viên đã đăng ký bằng giá khoá được bán ở thời điểm tại.
DELIMITER //

CREATE TRIGGER check_final_course_price_before_insert
BEFORE INSERT ON EnrollementCourse
FOR EACH ROW
BEGIN
    DECLARE salePrice MEDIUMINT UNSIGNED;

    -- Fetch the sale price from CourseHighlight
    SELECT sale_price INTO salePrice
    FROM CourseHighlight
    WHERE course_id = NEW.course_id;

    -- Check if the final course price matches the sale price
    IF NEW.final_course_price != salePrice THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The final course price does not match the sale price in CourseHighlight.';
    END IF;
END //

DELIMITER ;


-- 3. Tổng tiền hoá đơn thanh toán tại một thời điểm bằng tổng giá khoá học mà học viên đã mua tại thời điểm đó. 
DELIMITER //

CREATE TRIGGER check_payment_total_price
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE total_price DECIMAL(10, 2);

    -- Calculate the total sale_price from EnrollmentCourse for the learner
    SELECT SUM(sale_price) INTO total_price
    FROM EnrollmentCourse
    WHERE learner_id = NEW.learner_id;

    -- Check if the total_price matches the PaymentTotalPrice in the new record
    IF NEW.total_price != total_price THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: PaymentTotalPrice does not match the total sale_price';
    END IF;
END //

DELIMITER ;

-- 4. Tổng số khoá học mà học viên thanh toán tại một thời điểm bằng tổng số khoá học mà học viên đăng kí tham gia tại thời điểm đó. 
DELIMITER //

CREATE TRIGGER trg_after_insert_enrollment
AFTER INSERT ON EnrollementCourse
FOR EACH ROW
BEGIN
    -- Update the total_course count in the Payment table
    UPDATE Payment
    SET total_course = total_course + 1
    WHERE Learner_id = NEW.learner_id;
END //

DELIMITER ;

DELIMITER //

-- 11. Tổng tài liệu đính kèm tro	ng một học phần cho biết tổng số lượng tài liệu đính kèm trong học phần đó. 
CREATE TRIGGER UpdateDownloadableDocuments
AFTER INSERT ON Lecture
FOR EACH ROW
BEGIN
    DECLARE doc_count INT;

    -- Count the number of resources for the course
    SELECT COUNT(*) INTO doc_count
    FROM Lecture
    WHERE course_id = NEW.course_id;

    -- Update the CourseHighlight table
    UPDATE CourseHighlight
    SET downloadable_documents = doc_count
    WHERE course_id = NEW.course_id;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER check_fk_monthly_course_income
BEFORE INSERT ON MonthlyCourseIncomeVipInstructor
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    -- Kiểm tra nếu khóa ngoại (course_id, date) tồn tại trong bảng MonthlyCourseIncome
    SELECT COUNT(*) INTO v_count
    FROM MonthlyCourseIncome
    WHERE course_id = NEW.course_id AND date = NEW.date;
    
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Foreign key constraint failed: MonthlyCourseIncome record does not exist.';
    END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER check_fk_vip_instructor
BEFORE INSERT ON MonthlyCourseIncomeVipInstructor
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    -- Kiểm tra nếu khóa ngoại (vip_instructor_id) tồn tại trong bảng VipInstructor
    SELECT COUNT(*) INTO v_count
    FROM VipInstructor
    WHERE vip_instructor_id = NEW.vip_instructor_id;
    
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Foreign key constraint failed: VipInstructor record does not exist.';
    END IF;
END;
//

DELIMITER ;