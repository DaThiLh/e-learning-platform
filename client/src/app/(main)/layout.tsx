import StudentHeader from "@/components/header/student-header/StudentHeader";

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  const contentName: string = "Create a new course";
  return (
    <main className="flex flex-col w-full h-screen bg-background">
      <StudentHeader contentName={contentName} />
      {children}
    </main>
  );
}
