
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './UserMenu.module.css'
import MaterialSymbolIcon from 'MaterialSymbolIcon';
import { Button } from '@components';
import useClickOutside from '@/app/hooks/useClickOutside';

const UserMenu: React.FC = () => {
  const router = useRouter();
  const userMenuRef = useRef<any>(null)
  const userEmail = Cookies.get('email')

  const signOut = () => {
    ['refreshToken', 'accessToken', 'userId', 'userName'].forEach((cookie) => {
      Cookies.remove(cookie)
    })
    router.push('/auth')
  }
  return (
    <div ref={userMenuRef} className={styles.container} >
      <h2>{userEmail}</h2>
      <MaterialSymbolIcon title='account_circle' size={120} />
      <div onClick={signOut}>
        <Button title="Sign Out" textColor='#0b57d0' />
      </div>
    </div>
  );
};

export default UserMenu;

