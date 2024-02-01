
import React, { createRef } from 'react';
import Api from 'AxiosInterceptor';

const FileUpload = () => {
  const fileRef = createRef<HTMLInputElement>();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (fileRef.current && fileRef.current.files) {
        formData.append('file', fileRef.current.files[0]);
        const response = await Api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('File uploaded successfully. Download URL:', response.data);
      }
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

