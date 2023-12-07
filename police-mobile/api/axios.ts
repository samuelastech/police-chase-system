import fetch from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER;

export const axios = fetch.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = fetch.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
