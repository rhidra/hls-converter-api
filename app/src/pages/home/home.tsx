import React from 'react';
import Header from '../../layouts/header';
import FileUploader from './FileUploader';

export default function Home() {


  return (
    <div className="main-layout">
      <Header/>

      <FileUploader/>
    </div>
  );
}
