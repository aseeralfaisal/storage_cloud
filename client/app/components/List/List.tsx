import React, { useRef } from 'react'
import { ListProp } from './List.type'
import styles from './List.module.css'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setIsModal, setIsTookAction } from '@/app/store/slice';
import Api from '@/app/service/Api.interceptor';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

const List: React.FC<ListProp> = ({ children, isVisible }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const params = useParams()
  const isTookAction = useAppSelector(state => state.slice.isTookAction)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await Api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      const path = response.data;
      if (!path) return;
      const res = await Api.post("/create_file", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        path: path,
        ownerId: +Cookies?.get('userId'),
        directoryId: +params?.id
      })
      if (res.status === 200) {
        dispatch(setIsTookAction(!isTookAction))
      }
    } catch (error) {
      console.log(error)
    }
  };


  const onClick = async (e) => {
    const type = e.target.dataset.type
    if (type === "new_folder") {
      dispatch(setIsModal(true));
    } else if (type === "file_upload") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  return (
    <ul onClick={onClick} className={styles.container} style={{ display: isVisible ? 'block' : 'none' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
      {children}
    </ul>
  )
}

export default List
