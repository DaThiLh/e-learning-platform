import StudentHeader from "@/components/header/student-header/StudentHeader";

type CourseDetailProps = {
  children: React.ReactNode;
}

export default function CourseDetailLayout({children}: CourseDetailProps) {
  const contentName: string = "Course Detail";

  return (
    <main>
      <StudentHeader contentName={contentName} />
      {children}
    </main>
  )
}