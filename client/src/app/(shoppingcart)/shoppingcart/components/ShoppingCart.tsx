'use client';

import React, { useState } from "react";
import Item from "./Item";
import Decimal from 'decimal.js';
import s from "./ShoppingCart.module.scss";
import { Button } from "antd";
import { cn } from "@/libs/utils";
import { ArrowRightOutlined } from '@ant-design/icons';

const ShopppingCart = () => {
  const [courseData, setCourseData] = useState([
    { star: 5, courseTitle: "Course 1", instructors: ["Instructor 1", "Instructor 2"], price: new Decimal(49.99) },
    { star: 4, courseTitle: "Course 2", instructors: ["Instructor 3", "Instructor 4"], price: new Decimal(39.99) },
    { star: 4, courseTitle: "Course 3", instructors: ["Instructor 5", "Instructor 6"], price: new Decimal(29.99) },
    { star: 4, courseTitle: "Course 4", instructors: ["Instructor 7", "Instructor 8"], price: new Decimal(19.99) },
    { star: 4, courseTitle: "Course 5", instructors: ["Instructor 9", "Instructor 10"], price: new Decimal(9.99) },
  ]);

  const removeItem = (courseTitle: string) => {
    setCourseData((prevCourses) => {
      const updatedCourses = prevCourses.filter(course => course.courseTitle !== courseTitle);
      console.log(`Removed item: ${courseTitle}`); // Log the removed item
      return updatedCourses;
    });
  };

  return (
    <div className ={cn (s.shoppingCartContainer, " h-full w-9/12 mx-auto flex flex-row sm:my-5 lg:my-16 ")}>
        <div className="w-3/4 h-fit relative border-2">
          <div className="w-full sticky top-0 z-10 p-2 flex border-b-2">
            <div className="grow text-lg">COURSE</div>
            <div className="lg:w-[158px] sm:w-[110px] text-lg">PRICES</div>
          </div>
          <div className="w-full overflow-auto h-auto lg:max-h-[calc(100vh-260px)] sm:max-h-[calc(100vh-200px)]">
            {courseData.map((course, index) => (
              <Item
                key={index}
                star={course.star}
                courseTitle={course.courseTitle}
                instructors={course.instructors}
                price={course.price}
                onRemove={removeItem} // Pass the remove function
              />
            ))}
          </div>
        </div>
        <div className="ml-10 w-1/4 h-full">
            <div className=" w-full flex flex-col">
                <div className=" container" >
                    <div>Subtotal</div>
                    <div >$61.97 USD</div>
                </div>
                <div className=" container"> 
                    <div>Coupon Discount</div>
                    <div>8%</div>
                </div>
                <div className=" container">
                    <div>Taxs</div>
                    <div>$17.99 USD</div>
                </div>
                <div className="container">
                    <div>Total</div>
                    <div className="text-2xl	">$75.00 USD</div>
                </div>
            </div>
            <div className = "sm:block lg:hidden">
              <Button type="primary" id="checkout" >
                Checkout 
                <ArrowRightOutlined />
              </Button>
            </div>
            <div className ="sm:hidden lg:block">
              <Button type="primary" id="checkout" >
                Proceed to checkout 
                <ArrowRightOutlined />
              </Button>
            </div>
        </div>
    </div>
  );
};

export default ShopppingCart;
