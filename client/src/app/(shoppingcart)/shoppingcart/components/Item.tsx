import React from 'react';
import Image from 'next/image';
import Decimal from 'decimal.js';
import { CloseCircleOutlined } from '@ant-design/icons';

// Define the props interface
interface ItemProps {
  star: number; 
  courseTitle: string;
  instructors: string[];
  price: Decimal;
  onRemove: (courseTitle: string) => void; // Add the onRemove prop type
}

const Item: React.FC<ItemProps> = ({ star, courseTitle, instructors, price, onRemove }) => {
  return (
    <div className="w-full flex flex-row border-b-2">
      <div className="grow flex items-center justify-between">
        <div className="lg:w-[150px] lg:h-[100px] md:w-[100px] md:h-[50px] sm:w-[60px] sm:h-[40px] m-5 relative overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Kitten"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="grow">
          <p>{`Stars: ${star}`}</p>
          <h4 className="sm:text-base font-semibold ">{courseTitle}</h4>
          <div className="truncate xl:w-[300px] pr-3 lg:w-[150px] w-[100px] instructors sm:text-xs ">
            {instructors.map((instructor, index) => (
              <span key={index}>{instructor}{index < instructors.length - 1 && ', '}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[60px] flex items-center justify-left font-semibold text-orange lg:mr-10 sm:mx-3 sm:text-base text-lg">
        <p>{`$${price.toFixed(2)}`}</p>
      </div>
      <div 
        className="w-[20px] flex items-center lg:mr-10 sm:mr-5 cursor-pointer"
        onClick={() => onRemove(courseTitle)} // Call onRemove with courseTitle
      >
        <CloseCircleOutlined />
      </div>
    </div>
  );
};

export default Item;
