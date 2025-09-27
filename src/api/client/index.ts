// import {getToken} from '@/src/api/auth/tokenStorage';
// import axios from 'axios';
//
// const apiClient = axios.create({
//   baseURL: 'https://api.bewhoop.com',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
//
// apiClient.interceptors.request.use(
//   async config => {
//     const token = await getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );
//
// export default apiClient;
