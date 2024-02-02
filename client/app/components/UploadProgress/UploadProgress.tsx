import React from 'react'
import styles from './UploadProgress.module.css'
import MaterialSymbolIcon from '../MaterialSymbolIcon/MaterialSymbolIcon'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setUploadProgressVisible } from '@/app/store/slice'

const UploadProgress = () => {
  const dispatch = useAppDispatch();
  const { uploadFileName, uploadProgressVisible, isUploading } = useAppSelector(state => state.slice);

  const onClose = () => {
    dispatch(setUploadProgressVisible(false))
  }

  if (!uploadProgressVisible) {
    return <></>
  } else return (
    <div className={styles.container}>
      <div style={{ display: 'flex', padding: 10, backgroundColor: "#f8fafd", height: 60, alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <label style={{ fontSize: 16, fontWeight: 500 }}>Uploading file</label>
        </div>
        <div style={{ display: 'flex' }}>
          <MaterialSymbolIcon enableHover title='expand_more' size={26} />
          <div onClick={onClose}>
            <MaterialSymbolIcon enableHover title='close' size={24} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', padding: "8px 15px", gap: 15, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <img className="a-Ua-c" src="//ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_image_x16.png" alt="Image" />
          <span>{uploadFileName.slice(0, 10)} Name</span>
        </div>
        <>
          {isUploading ?
            <MaterialSymbolIcon title='download' />
            :
            <svg style={{ marginRight: 10 }} className="a-s-fa-Ha-pa c-qd" width="24px" height="24px" viewBox="0 0 24 24" fill="#0F9D58"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
          }
        </>
      </div>
    </div>
  )
}

export default UploadProgress
