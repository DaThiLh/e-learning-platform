interface Course {
  id: number;
  title: string;
  subcategory_name: string;
  students_enrolled: number;
  average_rating: number;
  sale_price: string;
  intructor_name: string;
}

interface CourseDetail {
  course_id: string;
  course_title: string;
  course_subtitle: string;
  course_description: string;
  course_language: string;
  course_requirement: string;
  course_image: string;
  course_tier_id: number;
  course_status: string;
  course_subcategory_id: string;
  course_objectives: string;
  subcategory_name: string;
  tier_price: number;
  instructor_name: string[];
  course_downloadable_documents: string[];
  course_students_enrolled: number;
  course_average_rating: string;
  course_sale_price: number;
  course_no_sections: number;
  course_duration: string;
  promotional_program_names: string[];
  promotional_program_contents: string[];
  promotional_program_day_starts: string;
  promotional_program_day_ends: string;
  promotional_program_tier_differences: string[];
  section: string;
}
