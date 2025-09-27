// import apiClient from '@/src/api/client';
//
// export const fetchNotifications = async (page: number, limit: number, type?: string) => {
//   return await apiClient.get(`/notifications?page=${page}&limit=${limit}&type=${type || ''}`);
// };
//
// export const fetchUnreadCount = async () => {
//   return await apiClient.get(`/notifications/unread-count`);
// };
//
// export const markNotificationAsRead = async (id: string) => {
//   return await apiClient.put(`/notifications/${id}/read`);
// };
//
// export const markAllNotificationAsRead = async () => {
//   return await apiClient.put(`/notifications/read-all`);
// };
//
// export const deleteNotification = async (id: string) => {
//   return await apiClient.put(`/notifications/${id}`);
// };
//
// export const createPokeNotification = async (event_id: string, mentioned_user_id: string, comment_id: string) => {
//   return await apiClient.post(`/notifications/poke`, {event_id, mentioned_user_id, comment_id});
// };
//
// export const createEventChangeNotification = async (event_id: string, change_type: string, message: string) => {
//   return await apiClient.post(`/notifications/event-change`, {event_id, change_type, message});
// };
//
// export const processEventReminders = async () => {
//   return await apiClient.post(`/notifications/process-reminders`);
// };
