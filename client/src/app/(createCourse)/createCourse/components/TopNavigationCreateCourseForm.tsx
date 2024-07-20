'use client';
import React from 'react'
import { MenuProps, Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Basic Information',
    key: 'basic-information',
  }, {
    label: 'Advance Infomation',
    key: 'advance-information',
  }, {
    label: 'Curriculum',
    key: 'curriculum',
  }, {
    label: 'Publish Course',
    key: 'publish-course',
  }
];

const TopNavigationCreateCourseForm = () => {
  return (
    <div className='TopNavCreateCourse'>
      <Menu mode='horizontal' items={items} />
    </div>
  )
}

export default TopNavigationCreateCourseForm
