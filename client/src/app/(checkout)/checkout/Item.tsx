import React from 'react';
import Image from 'next/image';
import Decimal from 'decimal.js';
import { CloseCircleOutlined } from '@ant-design/icons';

// Define the props interface
interface ItemProps {
  courseTitle: string;
  instructors: string[];
  price: Decimal;
}

const Item: React.FC<ItemProps> = ({ courseTitle, instructors, price }) => {
  return (
    <div className="w-full flex flex-row border-b-2 sm:py-0 2xl:py-3">
      <div className="grow flex items-center justify-between sm:ml-2 lg:ml-3 2xl:ml-5">
        <div className="sm:w-[64px] sm:h-[32px] lg:w-[80px] lg:h-[50px]  sm:my-2 sm:mr-2  relative">
          <Image
            src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Kitten"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="grow ">
          <h4 className ="sm:text-base sm:font-medium 2xl:text-2xl">{courseTitle}</h4>
          <div className="truncate xl:w-[300px] pr-3 w-[100px] instructors sm:text-xs ">
            {instructors.map((instructor, index) => (
              <span key={index}>{instructor}{index < instructors.length - 1 && ', '}</span>
            ))}
          </div>
          <div className ="text-xs sm:block 2xl:hidden sm:pb-1">
            {`$${price.toFixed(2)}`}
          </div>
        </div>
      </div>
      <div className="w-[80px] sm:hidden 2xl:flex flex items-center justify-left font-semibold text-orange lg:mx-20 sm:mx-10 text-lg">
        <p>{`$${price.toFixed(2)}`}</p>
      </div>
    </div>
  );
};

export default Item;
