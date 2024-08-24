use defaultdb;

create index idx_title_on_course on Course (title);
create index idx_date_on_payment on Payment (date);
create index idx_date_and_tied_difference_on_promotional_programm on PromotionalProgram (day_start, day_end, tier_difference);


-- partition
ALTER TABLE MonthlyCourseIncome DROP FOREIGN KEY FK_MonthlyCourseIncome_Course;

ALTER TABLE MonthlyCourseIncome
PARTITION BY RANGE (YEAR(date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p2027 VALUES LESS THAN (2028),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

DELIMITER //

CREATE TRIGGER check_fk_monthly_course_income
BEFORE INSERT ON MonthlyCourseIncomeVipInstructor
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count
    FROM MonthlyCourseIncome
    WHERE course_id = NEW.course_id AND date = NEW.date;
    
    IF v_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Foreign key constraint failed: MonthlyCourseIncome record does not exist.';
    END IF;
END //

DELIMITER ;

