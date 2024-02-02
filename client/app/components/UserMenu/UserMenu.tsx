
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MaterialSymbolIcon from 'MaterialSymbolIcon';
import { Button } from '@components';
import styles from './UserMenu.module.css'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import useClickOutside from '@/app/hooks/useClickOutside';
import { setProfileImgSrc, toggleUserMenu } from '@/app/store/slice';
import Api from '@/app/service/Api.interceptor';

const UserMenu: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userMenuVisible, profileImgSrc } = useAppSelector((state) => state.slice)
  const userEmail = Cookies.get('email')
  const userMenuRef = useRef(null);
  const profileUploadRef = useRef<any>(null);

  const signOut = () => {
    ['refreshToken', 'accessToken', 'userId', 'userName'].forEach((cookie) => {
      Cookies.remove(cookie)
    })
    router.push('/auth')
  }

  const userName = Cookies.get('userName');

  useClickOutside(userMenuRef, () => {
    dispatch(toggleUserMenu(false))
  })

  const handleUploadProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await Api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      let profilePicture;
      if (response.status === 200) {
        profilePicture = response.data;
      }

      const userId = Cookies.get('userId')
      if (!userId) return;
      const update = await Api.post("/update_user_info", {
        id: +userId,
        profilePicture
      });

      if (update.status === 200) {
        dispatch(setProfileImgSrc(profilePicture))
      }
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div ref={userMenuRef} className={styles.container} style={{ display: userMenuVisible ? 'flex' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
        <div style={{ marginLeft: 160 }}>
          <span style={{ fontSize: 14, fontWeight: 500, marginTop: 20 }}>{userEmail}</span>
        </div>
        <div style={{ marginRight: 10 }}>
          <MaterialSymbolIcon title='close' enableHover />
        </div>
      </div>
      <div style={{ marginTop: 20 }} onClick={() => profileUploadRef?.current?.click()}>
        <input ref={profileUploadRef} type='file' style={{ display: 'none' }} onChange={handleUploadProfile} />
        {profileImgSrc ?
          <img src={profileImgSrc} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50% ' }} />
          :
          <MaterialSymbolIcon title='account_circle' size={100} />
        }
      </div>
      <span style={{ fontSize: 22, textTransform: 'capitalize' }}>Hi, {userName}!</span>
      <div style={{ marginTop: 20 }}>
        <Button title="Manage your account" textColor='#0b57d0' />
      </div>
      <div className={styles.belowBtnContainer}>
        <div className={styles.addAccountBtn}>
          <MaterialSymbolIcon title='add_circle' />
          <span style={{ fontSize: 14 }}>
            Add account
          </span>
        </div>
        <div className={styles.signOutBtn} onClick={signOut}>
          <MaterialSymbolIcon title='logout' />
          <span style={{ fontSize: 14 }}>
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;

