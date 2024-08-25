interface Course {
  id: string;
  title: string;
  subcategory_name: string;
  instructor_name: string;
  students_enrolled: string;
  average_rating: number;
  sale_price: string;
  original_price: string;
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


interface ShoppingCart {
  map(arg0: (course: { average_rating: any; title: any; instructor_name: any; sale_price: import("decimal.js").default.Value; }) => { star: any; courseTitle: any; instructors: any[]; price: import("decimal.js").default; }): unknown;
  id: number;
  title: string;
  subcategory_name: string;
  instructor_name: string;
  students_enrolled: number;
  average_rating: number;
  sale_price: string;
  original_price: string;
}