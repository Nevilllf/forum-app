import { jwtDecode } from 'jwt-decode';
// import { useContext } from 'react';


export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserInfoFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded; // contains { id, name, iat, exp }
  } catch (err) {
    return null;
  }
};
