'use client';
import { cn } from "@/libs/utils";
import Image from 'next/image';
import CardButton from "./CardButton";
import React, { useState,useEffect } from "react";
import Item from "./Item";
import Decimal from 'decimal.js';
import s from "./CheckOut.module.scss";
import { Button } from "antd";

const CheckOut = ({ courseId }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (id: string) => {
    setActiveButton(id);
  };

  const cardButtons = [
    { id: 'card1' },
    { id: 'card2' },
    { id: 'card3' }
  ];

  async function handlePaymentRequest() {
    const response = await fetch('http://localhost:5000/payment', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    // Display the data or a success message in an alert
    alert(`Payment request successful`);
  }
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/coursedetail/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch course details");

        const course: CourseDetail = await res.json();
        console.log("me", course);
        setCourseData(course);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourseData();
  }, [courseId]);
  if (!courseData) return <p>Loading...</p>;
  return (
    <div className={cn(s.checkOutContainer, "h-full w-9/12 mx-auto flex flex-row sm:my-5 lg:my-7")}>
      <div className="w-1/2 h-fit ">
        <h2>Payment</h2>
        <div className="w-full h-fit flex flex-col space-y-4 mt-7">
          {cardButtons.map((card) => (
            <CardButton
              key={card.id}
              id={card.id}
              isActive={activeButton === card.id}
              onClick={handleButtonClick}
            />
          ))}
        </div>
      </div>
      <div className="ml-10 w-1/2 h-fit pb-4 border-2">
        <div className="text-lg font-semibold pl-3 w-full sticky top-0 z-20 bg-white py-1 border-b-2">
          Courses
        </div>
        
        <div className="w-full border-b-2  relative">
            <Item
              courseTitle={courseData.course_title}
              instructors={courseData.instructor_name}
              oriPrice={courseData.tier_price}
              salePrice={courseData.course_sale_price}
            />
        </div>
        <div className="px-5 pt-2">
          <div className="sm:text-base 2xl:text-xl font-semibold mb-3">
            Order Summary
          </div>
          <div className="w-full flex flex-col">
            <div className="container">
              <div>Subtotal</div>
              <div>{courseData.course_sale_price}</div>
            </div>
            <div className="container">
              <div>Coupon Discount</div>
              <div>0%</div>
            </div>
            <div className="container">
              <div>Total:</div>
              <div className="text-base">{courseData.course_sale_price}</div>
            </div>
          </div>
          <div>
            <Button type="primary" onClick={() => handlePaymentRequest()}>
              Complete Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
