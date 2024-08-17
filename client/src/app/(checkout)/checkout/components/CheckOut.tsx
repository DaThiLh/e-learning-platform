'use client';
import { cn } from "@/libs/utils";
import Image from 'next/image';
import CardButton from "./CardButton";
import React, { useState } from "react";
import Item from "./Item";
import Decimal from 'decimal.js';
import s from "./CheckOut.module.scss";
import { Button } from "antd";

const CheckOut = () => {
  const [courseData, setCourseData] = useState([
    {  courseTitle: "Course 1", instructors: ["Instructor 1", "Instructor 2","Instructor 1", "Instructor 2","Instructor 1", "Instructor 2"], price: new Decimal(49.99) },
    {  courseTitle: "Course 2", instructors: ["Instructor 3", "Instructor 4"], price: new Decimal(39.99) },
    {  courseTitle: "Course 3", instructors: ["Instructor 5", "Instructor 6"], price: new Decimal(29.99) },
    {  courseTitle: "Course 4", instructors: ["Instructor 7", "Instructor 8"], price: new Decimal(19.99) },
    {  courseTitle: "Course 5", instructors: ["Instructor 9", "Instructor 10"], price: new Decimal(9.99) },
    {  courseTitle: "Course 4", instructors: ["Instructor 7", "Instructor 8"], price: new Decimal(19.99) },
    {  courseTitle: "Course 5", instructors: ["Instructor 9", "Instructor 10"], price: new Decimal(9.99) },
  ]);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (id: string) => {
    setActiveButton(id);
  };

  const cardButtons = [
    { id: 'card1' },
    { id: 'card2' },
    { id: 'card3' }
  ];

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
      <div className="ml-10 w-1/2 h-full border-2">
        <div className="text-lg font-semibold pl-3 w-full sticky top-0 z-20 bg-white py-1 border-b-2">
          Courses({courseData.length})
        </div>
        <div className="w-full overflow-auto border-b-2 h-auto lg:max-h-[calc(100vh-385px)] xl:max-h-[calc(100vh-380px)] sm:max-h-[calc(100vh-360px)] relative">
          {courseData.map((course, index) => (
            <Item
              key={index}
              courseTitle={course.courseTitle}
              instructors={course.instructors}
              price={course.price}
            />
          ))}
        </div>
        <div className="px-5 pt-2">
          <div className="sm:text-base 2xl:text-xl font-semibold mb-3">
            Order Summary
          </div>
          <div className="w-full flex flex-col">
            <div className="container">
              <div>Subtotal</div>
              <div>$61.97 USD</div>
            </div>
            <div className="container">
              <div>Coupon Discount</div>
              <div>8%</div>
            </div>
            <div className="container">
              <div>Total:</div>
              <div className="text-base">$75.00 USD</div>
            </div>
          </div>
          <div>
            <Button type="primary" >
              Complete Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
