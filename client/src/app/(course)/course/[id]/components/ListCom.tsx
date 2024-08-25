import { Button } from 'antd';
import React from 'react';
import s from './ListCom.module.scss';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Rate } from 'antd';
import { Flex, Progress } from 'antd';
import type { ProgressProps } from 'antd';
import { Select, Space } from 'antd';

import { Collapse, List } from 'antd';
import { FileOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
interface CourseDetailProps {
  course: CourseDetail; // Ensure this is the correct type
}

const ListCom: React.FC<CourseDetailProps> = ({ course }) => {
  const [activeButton, setActiveButton] = useState<string>("b1");
  const handleButtonClick = (id: string) => {
    setActiveButton(id);
  };
  const gettingStartedData = [
    { icon: <PlayCircleOutlined />, title: "What's is Webflow?", time: "07:31", url: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { icon: <PlayCircleOutlined />, title: "Sign up in Webflow", time: "07:31", url: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { icon: <FileOutlined />, title: "Webflow Terms & Conditions", size: "5.3 MB", url: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { icon: <PlayCircleOutlined />, title: "Teaser of Webflow", time: "07:31", url: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
    { icon: <FileOutlined />, title: "Practice Project", size: "5.3 MB", url: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" }
  ];
  const Data = [
    { icon: <PlayCircleOutlined />, title: "What's is Webflow?", time: "07:31", },
    { icon: <PlayCircleOutlined />, title: "Sign up in Webflow", time: "07:31",  },
    { icon: <FileOutlined />, title: "Webflow Terms & Conditions", size: "5.3 MB",  },
    { icon: <PlayCircleOutlined />, title: "Teaser of Webflow", time: "07:31",},
    { icon: <FileOutlined />, title: "Practice Project", size: "5.3 MB", }
  ];
  
  const renderLectureItem = (item) => (
    <List.Item>
      <div className="flex justify-between items-center w-full text-xs">
        <div className="flex flex-row">
          <div className ="mr-3">{item.icon}</div>
          {/* Render Link only for the first panel */}
          {item.url ? (
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <div className ="text-orange underline underline-offset-1">
                {item.title}
              </div>
            </Link>
          ) : (
            <div>
              {item.title}
            </div>
          )}
        </div>
        <div >
          {item.time ? `${item.time}` : `(${item.size})`}
        </div>
      </div>
    </List.Item>
  );
  const instructors = [
    {
      name: "John Doe",
      title: "Web Developer & Tech Enthusiast",
      image: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Ensure this image is in the public folder
      description: "John is passionate about web development and has over 10 years of experience in building dynamic web applications.",
    },
    {
      name: "Jane Smith",
      title: "Graphic Designer & Illustrator",
      image: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Ensure this image is in the public folder
      description: "Jane is an expert in visual design and has helped numerous brands with her creativity and artistic skills.",
    },
    {
      name: "Alex Johnson",
      title: "Entrepreneur & Startup Advisor",
      image: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Ensure this image is in the public folder
      description: "Alex has launched several successful startups and enjoys mentoring young entrepreneurs in achieving their goals.",
    },
    {
      name: "Emily White",
      title: "Marketing Strategist & SEO Expert",
      image: "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Ensure this image is in the public folder
      description: "Emily specializes in digital marketing strategies and has helped businesses grow their online presence through effective SEO tactics.",
    }
  ];
  const curriculumData = [
    { title: "Getting Started", lectures: "4 Lectures | 51m", key: "1" },
    { title: "Secret of Good Design", lectures: "52 Lectures | 5h 49m", key: "2" },
  ];
  const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#87d068',
    '50%': '#ffe58f',
    '100%': '#ffccc7',
  };
  const courseFeatures = [
    {
      id: 1,
      learn: "You will learn how to design beautiful websites using Figma, an interface design tool used by designers at Uber, Airbnb, and Microsoft.",
    },
    {
      id: 2,
      learn: "You will learn secret tips of Freelance Web Designers and how they make great money freelancing online.",
    },
    
  ];
  
  type RatingCounts = {
    [key: number]: number;
  };
  
  const reviews = [
    { userId: 1, userName:"User 1" ,rating: 5, review: "Excellent product! Exceeded my expectations in every way." },
    { userId: 2, userName:"User 1", rating: 4, review: "Very good, but there are a few minor issues. Overall, I’m satisfied." },
    { userId: 3, userName:"User 1", rating: 4, review: "Average experience. It works, but there’s room for improvement." },
    { userId: 4, userName:"User 1", rating: 2, review: "Not great. Had several problems and wasn’t as useful as I hoped." },
    { userId: 5, userName:"User 1", rating: 5, review: "Very disappointing. Didn’t meet any of my expectations." }
  ];
  const [selectedRating, setSelectedRating] = useState<string | undefined>(undefined);

  // Filter reviews based on the selected rating
  const filteredReviews = selectedRating
    ? reviews.filter(review => review.rating === parseInt(selectedRating))
    : reviews;

  const [ratingCounts, setRatingCounts] = useState<RatingCounts>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });


  return (
    <div className={cn(s.ListComContainer, 'w-full flex flex-col')}>
      <div className="w-full border-b mt-2">
        <Button
          type="primary"
          id="b1"
          className={activeButton === 'b1' ? 'clicked' : ''}
          onClick={() => handleButtonClick('b1')}
        >
          Overview
        </Button>
        <Button
          type="primary"
          id="b2"
          className={activeButton === 'b2' ? 'clicked' : ''}
          onClick={() => handleButtonClick('b2')}
        >
          Curriculum
        </Button>
        <Button
          type="primary"
          id="b3"
          className={activeButton === 'b3' ? 'clicked' : ''}
          onClick={() => handleButtonClick('b3')}
        >
          Instructor
        </Button>
        <Button
          type="primary"
          id="b4"
          className={activeButton === 'b4' ? 'clicked' : ''}
          onClick={() => handleButtonClick('b4')}
        >
          Review
        </Button>
      </div>
      <div>
        {activeButton === 'b1' &&
        <div className ="my-5">
          <h1 className ="text-base">Description</h1>
          <p className ="text-xs">{course.course_description}</p>
          <p className ="text-xs">{}</p>
          <div className="p-5 bg-gray-100 rounded-md my-5">
            <h1 className="font-semibold mb-4 text-base">What you will learn in this course</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
              {courseFeatures.map((feature) => (
                <li key={feature.id} className="flex items-start text-xs">
                  <span className="text-green-500 mr-2">✔️</span>
                  <p>{feature.learn}</p>
                </li>
              ))}
            </ul>
          </div>
          <div >
            <h1 className="font-semibold mb-4 text-base">Course Requirement</h1>
            <ul className="list-disc pl-5">
              {courseFeatures.map((feature) => (
                <li key={feature.id} className="mb-2 text-xs">
                  <p>{feature.learn}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        }
        {activeButton === 'b2' &&
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className ="flex md:flex-row sm:flex-col justify-between"> 
              <h1 className ="md:my-3 sm:mt-4 text-base">Curriculum</h1>
              <div className ="my-3 text-xs flex items-center">2 Sections | 56 Lectures | 6h 40m</div>
            </div>
            <Collapse accordion>
              {curriculumData.map((item) => (
                <Panel
                  header={<span className="text-xs font-medium">{item.title}</span>}
                  key={item.key}
                  extra={ <span className="text-xs lg:block sm:hidden ">{item.lectures}</span>}
                >
                  {
                    item.key === "1" ? (
                      <List
                        dataSource={gettingStartedData}
                        renderItem={renderLectureItem}
                        bordered
                      />
                    ) : (
                      <List
                        dataSource={Data}
                        renderItem={renderLectureItem}
                        bordered
                      />
                    )
                  }

                   
                </Panel>
              ))}
            </Collapse>
          </div>
        }
        {activeButton === 'b3' &&
        <div>
          <h1 className ="my-3 text-base font-semibold">Course Instructors</h1>
          {instructors.map((instructor, index) => (
            <div key={index} className =" flex flex-row p-3 border mb-3" >
              <div className="w-1/5 relative">
                <div className="pt-[100%] relative">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div className =" w-4/5 ml-4">
                <h3 className ="text-base">{instructor.name}</h3>
                <p className ="text-xs my-1">{instructor.title}</p>
                <p className ="text-xs">{instructor.description}</p>
              </div>
            </div>
          ))}
        </div>
        }
        {activeButton === 'b4' &&
        <div className ="w-full flex flex-col">
          <h1 className ="my-3 text-base font-semibold">Course Rating</h1>
          <div className ="flex flex-row">
            <div className="w-[140px] relative sm:mr-1 md:mr-3">
              <div className="pt-[100%] relative flex flex-col items-center justify-center border ">
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <div className ="font-medium text-2xl">4.8</div>
                  <Rate disabled allowHalf defaultValue={4.8} />
                  <div className="text-xs">Course Rating</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-4/5">
            {Object.entries(ratingCounts)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([star, count]) => {
                const percentage = Object.values(ratingCounts).reduce((acc, count) => acc + count, 0) ? (count / Object.values(ratingCounts).reduce((acc, count) => acc + count, 0)) * 100 : 0;
                return (
                  <div key={star} id={`item_star_${star}`} className="flex items-center">
                    <div className='w-max xl:block sm:hidden'>
                      <Rate disabled defaultValue={parseInt(star)} />
                    </div>
                    <div className='w-max pl-3 pr-3 text-xs'>
                      <span className="ml-2">{star} star rating</span>
                    </div>
                    <div className='grow'>
                      <Flex gap="small" vertical>
                        <Progress percent={percentage} strokeColor={conicColors} />
                      </Flex>
                    </div>
                  </div>
                );
              })}


            </div>

          </div>
          <div className ="flex flex-row justify-between my-3">
            <div className =" text-base font-semibold">Students Feedback</div>
            <div>
              <Select
                defaultValue="5"
                style={{ width: 120 }}
                onChange={(value) => setSelectedRating(value)}
                allowClear
                options={[{ value: '1', label: '1' },{ value: '2', label: '2' },{ value: '3', label: '3' },{ value: '4', label: '4' },{ value: '5', label: '5' }]}
                placeholder="select it"
              />
            </div>
          </div>
          <div>
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <div key={review.userId} className="review-item border-b p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="mr-3 flex items-center text-xs font-semibold">{review.userName}</div>
                    <div className="flex items-center">
                      <Rate disabled defaultValue={review.rating} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 text-xs">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs">No reviews for this rating.</p>
            )}
          </div>
          
        </div>
        }
      </div>
    </div>
  );
};

export default ListCom;
