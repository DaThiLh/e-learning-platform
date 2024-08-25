'use client';

import React, { useState, useEffect } from "react";
import Item from "./Item";
import Decimal from 'decimal.js';
import s from "./ShoppingCart.module.scss";
import { Button } from "antd";
import { cn } from "@/libs/utils";
import { ArrowRightOutlined } from '@ant-design/icons';

const ShopppingCart = ({
  shoppingCart,
}: {
  shoppingCart: Course[];
}) => {
  const [courseData, setCourseData] = useState([
    { star: 5, courseTitle: "Course 1", instructors: ["Instructor 1", "Instructor 2"], price: new Decimal(49), originalPrice: new Decimal(99) },
    { star: 4, courseTitle: "Course 2", instructors: ["Instructor 3", "Instructor 4"], price: new Decimal(39), originalPrice: new Decimal(99) },
    { star: 4, courseTitle: "Course 3", instructors: ["Instructor 5", "Instructor 6"], price: new Decimal(29), originalPrice: new Decimal(99) },
    { star: 4, courseTitle: "Course 4", instructors: ["Instructor 7", "Instructor 8"], price: new Decimal(19), originalPrice: new Decimal(99) },
    { star: 4, courseTitle: "Course 5", instructors: ["Instructor 9", "Instructor 10"], price: new Decimal(9), originalPrice: new Decimal(99) },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log('Shopping cart:', shoppingCart);
    const transformedData = shoppingCart.map((course) => ({
      star: course.average_rating + 2,
      courseTitle: course.title,
      instructors: course.instructor_name.split(', ').map(name => name.trim()),
      price: new Decimal(course.sale_price),
      originalPrice: new Decimal(course.original_price),
    }));

    setCourseData(transformedData);
  }, [shoppingCart]);

  useEffect(() => {
    const subtotal = courseData.reduce((acc, course) => acc.plus(course.originalPrice), new Decimal(0));
    const total = courseData.reduce((acc, course) => acc.plus(course.price), new Decimal(0));
    const couponDiscount = 100 - (total.toNumber() / subtotal.toNumber() * 100);

    setSubtotal(subtotal.toNumber());
    setTotal(total.toNumber());
    setCouponDiscount(couponDiscount.toFixed(0));
  }, [courseData]);

  const removeItem = (courseTitle: string) => {
    setCourseData((prevCourses) => {
      const updatedCourses = prevCourses.filter(course => course.courseTitle !== courseTitle);
      console.log(`Removed item: ${courseTitle}`); // Log the removed item
      return updatedCourses;
    });
  };

  return (
    <div className={cn(s.shoppingCartContainer, " h-full w-9/12 mx-auto flex flex-row sm:my-5 lg:my-16 ")}>
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
              originalPrice={course.originalPrice}
              onRemove={removeItem} // Pass the remove function
            />
          ))}
        </div>
      </div>
      <div className="ml-10 w-1/4 h-full">
        <div className=" w-full flex flex-col">
          <div className="font-medium	text-gray-500	">Total</div>
          <div className="container">
            <div className="text-2xl font-bold">
              ₫{total.toLocaleString()}
            </div>
          </div>
          <div className=" container" >
            <div className=" text-gray-500 line-through">
              ₫{subtotal.toLocaleString()}
            </div>
          </div>
          <div className=" container">
            <div className="font-thin"
            >{couponDiscount}% off</div>
          </div>
        </div>
        <div className="sm:block lg:hidden">
          <Button type="primary" id="checkout" >
            Checkout
            <ArrowRightOutlined />
          </Button>
        </div>
        <div className="sm:hidden lg:block pt-2">
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
