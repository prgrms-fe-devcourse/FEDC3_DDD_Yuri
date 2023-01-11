import { LoginResponse } from '../../types/response';
import { UserResponse } from '../../types/user';
import axiosInstance from '../axios';

export const signUp = async ({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) => {
  await axiosInstance.post<LoginResponse>('/signup', {
    email,
    password,
    fullName,
  });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post<LoginResponse>('/login', {
    email,
    password,
  });
  return data;
};

export const logout = async () => {
  await axiosInstance.post('/logout');
};

export const getUser = async (userId: string) => {
  const { data } = await axiosInstance.get<UserResponse>(`/users/${userId}`);
  return data;
};

export const getUsers = async () => {
  const { data } = await axiosInstance.get<UserResponse[]>('users/get-users');
  return data;
};
