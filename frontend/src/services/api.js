import axios from 'axios';
// import { useContext } from 'react';
import { getToken } from '../utils/auth';


const API = axios.create({
  //baseURL: import.meta.env.VITE_API_URL,
  baseURL: 'http://localhost:5001/api',
  withCredentials: false,
});

// Automatically attach token to requests
export const authAPI = () => {
  // console.log(getToken());
  return axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'http://localhost:5001/api',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};


export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);

export const incrementChannelView = (channelId) =>
  authAPI().post(`/channels/${channelId}/view`);

// channel-related API
export const getChannels = () => authAPI().get('/channels');
export const createChannel = (channelData) => authAPI().post('/channels', channelData);

export const getMessagesByChannel = (channelId) => authAPI().get(`/messages/${channelId}`);
// export const postMessageToChannel = (channelId, messageData) => authAPI().post(`/messages/${channelId}`, messageData);
export const postMessageToChannel = (channelId, formData) => {
  return authAPI().post(`/messages/${channelId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReplies = (messageId) => authAPI().get(`/replies/${messageId}`);
export const postReply = (messageId, replyData) => authAPI().post(`/replies/${messageId}`, replyData);

export const ratePost = (postId, rating) =>
  authAPI().post(`/ratings/post/${postId}`, { rating });

export const getUserVote = (postId) =>
  authAPI().get(`/ratings/post/${postId}/vote`);

export const rateReply = (replyId, rating) =>
  authAPI().post(`/ratings/replies/${replyId}/rate`, { rating });

export const getUserReplyVote = (replyId) =>
  authAPI().get(`/ratings/replies/${replyId}/vote`);

export const deleteChannel = (channelId) =>
  authAPI().delete(`/admin/channels/${channelId}`);

export const deletePost = (postId) => authAPI().delete(`/admin/messages/${postId}`);
export const deleteReply = (replyId) => authAPI().delete(`/admin/replies/${replyId}`);

export const getChannelById = (channelId) => authAPI().get(`/channels/${channelId}`);

export const getUserExplorer = () => authAPI().get('/users/explore');

export default API;
// export default {}; // <-- temp
