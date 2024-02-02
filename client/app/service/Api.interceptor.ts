import axios from 'axios';
import Cookies from 'js-cookie';

const Api = axios.create({ baseURL: process?.env?.NEXT_PUBLIC_BASE_URL });

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
    }
  }

  return config;
}, (error) => {
  console.log(error);
  return Promise.reject(error);
});


Api.interceptors.response.use((response) => response,
  async (error) => {
    console.log(error.response.status);
    if (error.response.status === 401) {
      try {
        const token = Cookies.get('refreshToken');
        const response = await Api.post(`/refresh-token`, { token });
        const newAccessToken = response.data.accessToken;
        Cookies.set('accessToken', newAccessToken);
        return Api(error.config);
      } catch (error) {
        console.log('Failed to refresh access token', error);
        return Promise.reject('Failed to refresh access token');
      }
    } else {
      console.log(error);
      return Promise.reject(error);
    }
  });
export default Api;

