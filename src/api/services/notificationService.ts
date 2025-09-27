// import {
//   createEventChangeNotification,
//   createPokeNotification,
//   deleteNotification,
//   fetchNotifications,
//   fetchUnreadCount,
//   markAllNotificationAsRead,
//   markNotificationAsRead,
//   processEventReminders,
// } from '@/src/api/endpoints/notifications';
//
// export const notificationService = {
//   getNotifications: async (page = 1, limit = 20, type?: string) => {
//     return await fetchNotifications(page, limit, (type = ''));
//   },
//   getUnreadCount: async () => {
//     return await fetchUnreadCount();
//   },
//   markAsRead: async (id: string) => {
//     return await markNotificationAsRead(id);
//   },
//   markAllAsRead: async () => {
//     return await markAllNotificationAsRead();
//   },
//   delete: async (id: string) => {
//     return await deleteNotification(id);
//   },
//   createPokeNotification: async (event_id: string, mentioned_user_id: string, comment_id: string) => {
//     return await createPokeNotification(event_id, mentioned_user_id, comment_id);
//   },
//   createEventChangeNotification: async (event_id: string, change_type: string, message: string) => {
//     return await createEventChangeNotification(event_id, change_type, message);
//   },
//   processReminders: async () => {
//     return await processEventReminders();
//   },
// };
