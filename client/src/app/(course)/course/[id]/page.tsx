import CourseDetailComponent from './components/CourseDetail';


const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div className="w-full flex flex-col items-center">
      <CourseDetailComponent courseId = {id}/>
    </div>
  );
};

export default page;
