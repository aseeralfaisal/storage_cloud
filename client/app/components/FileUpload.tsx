import React, { createRef } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const fileRef = createRef<any>(null);


  const handleUpload = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', fileRef.current.files[0]);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully. Download URL:', response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" ref={fileRef} />
        <input type='submit' value="Submit" />
      </form>
    </div>
  );
};

export default FileUpload;

