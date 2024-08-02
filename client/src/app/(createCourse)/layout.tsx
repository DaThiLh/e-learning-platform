import InstructorHeader from "@/components/header/instructor-header/InstructorHeader";

type CreateCourseLayoutProps = {
	children: React.ReactNode;
};

export default function CreateCourseLayout({
	children,
}: CreateCourseLayoutProps) {
	const content: string = "Create a new course";

	return (
		<main className="flex flex-col w-full h-fit min-h-screen items-center bg-background">
			<InstructorHeader contentName={content} />
			{children}
		</main>
	);
}
