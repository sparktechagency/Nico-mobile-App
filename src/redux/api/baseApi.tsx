import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface BaseQueryArgs extends AxiosRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

const baseQueryWithRath: BaseQueryFn<BaseQueryArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions,
) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const result: AxiosResponse = await axios({
      baseURL: 'http://182.252.68.227:10000/api/',
      ...args,
      url: args.url,
      method: args.method,
      data: args.body,
      headers: {
        ...args.headers,
        ...(token && { Authorization: `Bearer ${JSON.parse(token)}` }), // ✅ smart way
      },
    });

    if (typeof result?.data === 'string') {
      const withCurly = (result.data += '}');
      return { data: JSON.parse(withCurly) };
    }

    if (typeof result?.data === 'object') {
      return { data: result?.data };
    }

    return { data: result?.data };
  } catch (error: any) {
    if (error.response?.data) {
      if (typeof error.response?.data === 'string') {
        const withCurly = (error.response.data += '}');
        return { error: JSON.parse(withCurly) };
      } else {
        return { error: error.response?.data };
      }
    }
    return {
      error: {
        status: error.response?.status || 500,
        data: error.message || 'Something went wrong',
      },
    };
  }
};


export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRath,
  endpoints: () => ({}),
  tagTypes: [
    'auth',
    'attractions',
    'bucket',
    'friend',
    'dashboard',
    'equipment',
    'quests',
    'setting',
    'subscription',
  ],
});

export const ImageUrl = 'http://182.252.68.227:10000'; 

export const makeImage = (url: string) => {
  if (url) {
    return ImageUrl + url;
  }
  return '';
};