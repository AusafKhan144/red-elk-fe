// import {storeToken} from '@/src/api/auth/tokenStorage';
// import {forgotPassword, login, logout, signup} from '@/src/api/endpoints/auth';
//
// export const AuthService = {
//   signupUser: async (
//     email: string,
//     password: string,
//     interests: [string],
//     profileData: {name: string; bio: string; age: number; profile_pic: string; gender: string; dateOfBirth: string}
//   ) => {
//     return await signup(email, password, interests, profileData);
//   },
//
//   loginUser: async (email: string, password: string) => {
//     const response = await login(email, password);
//
//     if (response?.data?.token) {
//       await storeToken(response?.data?.token);
//     }
//     return response;
//   },
//
//   logoutUser: async () => {
//     return await logout();
//   },
//   forgotPassword: async (email: string) => {
//     return await forgotPassword(email);
//   },
// };
