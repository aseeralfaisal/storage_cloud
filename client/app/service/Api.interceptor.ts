import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.BASE_URL;

const Api = axios.create({ baseURL });

export const signOut = () => {
  ['refreshToken', 'accessToken', 'userId', 'userName'].forEach((cookie) => {
    Cookies.remove(cookie)
  })
  window.location.href = '/auth';
}

const errorMessage = 'API call failed';
const MAX_REFRESH_ATTEMPTS = 3;

let refreshAttempts = 0;

const requiresAuthentication = (url: string) => {
  const authenticatedRoutes = ['/get_folder_path', '/get_file'];

  return authenticatedRoutes.some((route) => url.startsWith(route));
};

Api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('accessToken');

  const configURL = config.url as string;
  if (requiresAuthentication(configURL)) {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log('No bearer token found. Logging out.');
      signOut();
    }
  }

  return config;
}, (error) => {
  console.log(errorMessage, error);
  signOut();
  return Promise.reject(error);
});


Api.interceptors.response.use((response) => response,
  async (error) => {
    console.log(error.response.status);
    if (error.response.status === 401) {
      if (refreshAttempts < MAX_REFRESH_ATTEMPTS) {
        try {
          const token = Cookies.get('refreshToken');
          const response = await Api.post(`/refresh-token`, { token });
          const newAccessToken = response.data.accessToken;
          Cookies.set('accessToken', newAccessToken);
          refreshAttempts += 1;
          return Api(error.config);
        } catch (error) {
          console.log('Failed to refresh access token', error);
          return Promise.reject('Failed to refresh access token');
        }
      } else {
        console.log('Max refresh attempts reached. Logging out.');
        signOut();
      }
    } else {
      console.log(errorMessage, error);
      signOut();
      return Promise.reject(errorMessage);
    }
  });
export default Api;

