import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';

interface CardButtonProps {
  id: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const CardButton: React.FC<CardButtonProps> = ({ id, isActive, onClick }) => (
  <div className="w-full h-fit border-2">
    <Button 
      type="primary" 
      id={id}
      className={isActive ? 'clicked' : ''}
      onClick={() => onClick(id)}
    >
      <div className="lg:w-[42px] lg:h-[19px]  sm:w-[27px] sm:h-[17px] md:w-[35px] md:h-[15px] xl:w-[52px] xl:h-[29px]  sm:m-1 m-5   relative overflow-hidden ">
        <Image
          src="https://www.mastercard.com.vn/content/dam/public/mastercardcom/vn/vi/logos/mc-logo-52.svg"
          alt="card"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="flex items-center mx-5 grow ">
        4855 0000 0000 0000
      </div>
      <div className="flex items-center mx-5 sm:hidden grow lg:block">
        04/24
      </div>
      <div className="flex items-center mx-5 sm:hidden grow xl:block">
        Vako Shvili
      </div>
    </Button>
  </div>
);

export default CardButton;
