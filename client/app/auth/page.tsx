'use client';

import React, { useState } from 'react';
import styles from './auth.module.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Api from 'AxiosInterceptor';
import { useAppDispatch } from '../store/hooks';
import { setProfileImgSrc } from '../store/slice';

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const handleRegisterLinkClick = () => {
    setRegisterMode(true);
  };

  const handleBackToLogin = () => {
    setRegisterMode(false);
  };

  const handleLogin = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await Api.post("/login_user", {
        email,
        password
      });

      const { accessToken, refreshToken, userId, userName, profilePicture } = response.data
      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);
      Cookies.set('userId', userId);
      Cookies.set('email', email)
      Cookies.set('userName', userName)
      dispatch(setProfileImgSrc(profilePicture))

      console.log(response.data)

      if (response.status === 200) {
        router.push(`/view/0`);
      } else {
        return setErrorMsg("User or Password Invalid")
      }

    } catch (error) {
      //@ts-ignore
      const errorResponse: any = error?.response
      if (!errorResponse) return setErrorMsg("User or Password Invalid")
      setErrorMsg(errorResponse?.data.error)
    }
  }

  const handleRegister = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await Api.post("create_user", {
        email,
        name,
        password,
      });
      if (response.status === 200) {
        setRegisterMode(false)
      }
    } catch (error) {
      console.error(error?.response)
      router.push('/auth')
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authBox} ${styles.noBoxShadow}`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {errorMsg !== "" && <span style={{ color: 'red', fontSize: 14, fontWeight: 500, textTransform: 'capitalize', textAlign: 'center' }}>{errorMsg}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <img style={{ width: 40, height: 40 }} src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" />
          <h2 style={{ marginBlock: 20, fontWeight: 400, textAlign: 'center', fontSize: 26, color: "#333" }}>{isRegisterMode ? "Register" : "Sign In"}</h2>
        </div>
        <h2 style={{ marginBlock: 20, fontWeight: 400, textAlign: 'center', fontSize: 18, color: "#333" }}>to continue Storage Cloud</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {isRegisterMode && <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>}
        <div className={styles.inputContainer}>
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={isRegisterMode ? handleRegister : handleLogin} type="submit" className={styles.button}>{isRegisterMode ? 'Register' : 'Login'}</button>
          <div className={styles.registerLink}>
            {isRegisterMode
              ? <>Already registered? <a role="button" onClick={handleBackToLogin}>Login</a></>
              : <>Not registered? <a role='button' onClick={handleRegisterLinkClick}>Register</a></>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
