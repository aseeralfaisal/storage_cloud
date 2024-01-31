
import { useRouter } from 'next/navigation';
import React from 'react';
import Cookies from 'js-cookie';

const UserMenu: React.FC = () => {
  const router = useRouter();

  return (
    <div className="user-menu" onClick={() => {
      Cookies.remove('refreshToken');
      Cookies.remove('accessToken');
      router.push('/auth')
    }}>
      Log out
      <style jsx>{`
        .user-menu {
          position: fixed;
          top: 50px; 
          right: 10px; 
          background-color: white;
          padding: 10px;
          border: 1px solid #ccc; 
          border-radius: 5px; 
          cursor: pointer
        }
      `}</style>
    </div>
  );
};

export default UserMenu;

