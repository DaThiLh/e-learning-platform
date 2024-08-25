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
    { title: "Practice Design Like an Artist", lectures: "43 Lectures | 53m", key: "3" },
    { title: "Web Development (Webflow)", lectures: "137 Lectures | 10h 6m", key: "4" },
    { title: "Secrets of Making Money Freelancing", lectures: "21 Lectures | 38m", key: "5" },
    { title: "Advanced", lectures: "39 Lectures | 91m", key: "6" }
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
    {
      id: 3,
      learn: "Understand how to use both the Jupyter Notebook and create .py files.",
    },
    {
      id: 4,
      learn: "You will learn how to take your designs and build them into powerful websites using Webflow, a state-of-the-art site builder used by teams at Dell, NASA, and more.",
    },
    {
      id: 5,
      learn: "Learn to use Python professionally, learning both Python 2 and Python 3!",
    },
    {
      id: 6,
      learn: "Get an understanding of how to create GUIs in the Jupyter Notebook system!",
    }
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
          <p className ="text-xs">It gives you a huge self-satisfaction when you look at your work and say, "I made this!". I love that feeling after I'm done working on something. When I lean back in my chair, look at the final result with a smile, and have this little "spark joy" moment. It's especially satisfying when I know I just made $5,000.
            I do! And that's why I got into this field. Not for the love of Web Design, which I do now. But for the LIFESTYLE! There are many ways one can achieve this lifestyle. This is my way. This is how I achieved a lifestyle I've been fantasizing about for five years. And I'm going to teach you the same. Often people think Web Design is complicated. That it needs some creative talent or knack for computers. Sure, a lot of people make it very complicated. People make the simplest things complicated. Like most subjects taught in the universities. But I don't like complicated. I like easy. I like life hacks. I like to take the shortest and simplest route to my destination. I haven't gone to an art school or have a computer science degree. I'm an outsider to this field who hacked himself into it, somehow ending up being a sought-after professional. That's how I'm going to teach you Web Design. So you're not demotivated on your way with needless complexity. So you enjoy the process because it's simple and fun. So you can become a Freelance Web Designer in no time.
            For example, this is a Design course but I don't teach you Photoshop. Because Photoshop is needlessly complicated for Web Design. But people still teach it to web designers. I don't. I teach Figma – a simple tool that is taking over the design world. You will be designing a complete website within a week while others are still learning how to create basic layouts in Photoshop.
            Second, this is a Development course. But I don't teach you how to code. Because for Web Design coding is needlessly complicated and takes too long to learn. Instead, I teach Webflow – a tool that is taking over the web design world. You will be building complex websites within two weeks while others are still learning the basics of HTML & CSS. Third, this is a Freelancing course. But I don't just teach you how to write great proposals. I give you a winning proposal template. When you're done with the course, you will have a stunning portfolio website with portfolio pieces already in it. Buy this course now and take it whenever the time is right for you.</p>
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
            <h1 className="font-semibold mb-4 text-base">What you will learn in this course</h1>
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
              <div className ="my-3 text-xs flex items-center">6 Sections | 202 Lectures | 19h 37m</div>
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
