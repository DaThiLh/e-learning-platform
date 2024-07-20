'use client';
import React from 'react'

type HeaderFormProps = {
  headerName: string;
}

const HeaderForm = ({ headerName }: HeaderFormProps) => {
  return (
    <header className="headerForm">
      <h2 className='text-left'>
        {headerName}
      </h2>
    </header>
  )
}

export default HeaderForm
