'use client';
import React from 'react'
import HeaderForm from './HeaderForm'
import { Form, Input, Select, Button } from 'antd'
import s from './BasicInformationForm.module.scss'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const categoryOptions = [
  { value: 'Java', label:'Java' },
  { value: 'C#', label: 'C#' },
];

const languageOptions = [
  { value: 'English', label:'English' },
  { value: 'Vietnamese', label: 'Vietnamese' },
];

const BasicInfomationForm = () => {
  return (
    <div className='w-full'>
      <HeaderForm headerName="Basic Information" />
      <div className={s.createFormContainer}>
        <Form {...formItemLayout} layout="vertical" className='createForm'>
        <div className=''>
          <Form.Item label="Title" name="title">
            <Input placeholder='Your course title' />            
          </Form.Item>

          <Form.Item label="Subtitle" name="subtitle">
            <Input placeholder='Your course subtitle' />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder='Your course description' />
          </Form.Item>

          <div className="form-row w-full">
            <Form.Item label="Category" name="category" className='w-full'>
              <Select placeholder='Select a category' suffixIcon={null}>
                {categoryOptions.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Language" name="language" className='w-full'>
              <Select placeholder='Select a language' suffixIcon={null}>
                {languageOptions.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className='button-form-row'>
            <Form.Item>
              <Button type="primary" className='buttonNext'>Cancel</Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" className='buttonNext' style={{ backgroundColor: '#FF6636' }}>Next</Button>
            </Form.Item>
          </div>
          </div>
        </Form>
      </div>
    </div>
  )
}


export default BasicInfomationForm
