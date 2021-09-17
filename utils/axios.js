import axios from 'axios';
import { Service } from 'axios-middleware';

const baseURL = 'https://staging-api.privcloud.com/api';

export const createAxios = (token) => {
  const defaultHeaders = (token) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  
    return headers;
  };
  
  const service = new Service(axios);
  
  service.register({
    onRequest(config) {
      return {
        ...config,
        headers: {
          ...config.headers,
          ...defaultHeaders(token),
        },
      };
    },
  });

  const INSTANCE = axios.create({
    baseURL,
  });

  return INSTANCE;
}
