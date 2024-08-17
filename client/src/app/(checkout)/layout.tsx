import StudentHeader from "@/components/header/student-header/StudentHeader";

type CheckOutProps = {
  children: React.ReactNode;
}

export default function CheckOutLayout({children}: CheckOutProps) {
  const contentName: string = "Check Out";

  return (
    <main>
      <StudentHeader contentName={contentName} />
      {children}
    </main>
  )
}