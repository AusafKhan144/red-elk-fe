// import apiClient from '@/src/api/client';
//
// export const signup = async (
//   email: string,
//   password: string,
//   interests: [string],
//   profileData: {name: string; bio: string; age: number; profile_pic: string; gender: string; dateOfBirth: string}
// ) => {
//   return await apiClient.post('/users/register', {identifier: email, password, profileData, interests});
// };
//
// export const login = async (email: string, password: string) => {
//   return await apiClient.post('/users/login', {identifier: email, password});
// };
//
// export const logout = async () => {
//   return await apiClient.post('/users/logout');
// };
// export const interests = async () => {
//   return await apiClient.get('/users/interest');
// };
// export const forgotPassword = async (email: string) => {
//   return await apiClient.patch('/users/forgot-password', {email});
// };
