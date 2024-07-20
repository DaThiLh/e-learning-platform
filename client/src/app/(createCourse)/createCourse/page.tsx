import React from 'react'
import BasicInfomationForm from './components/BasicInfomationForm'
import TopNavigationCreateCourseForm from './components/TopNavigationCreateCourseForm'

const BasicInformationPage = () => {
  return (
    <div className='basicInformationPage'>
      <TopNavigationCreateCourseForm/>
      <BasicInfomationForm />
    </div>
  )
}

export default BasicInformationPage
