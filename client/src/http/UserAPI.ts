import { AxiosResponse } from 'axios';
import { $host, $authHost } from './index';
import { jwtDecode } from 'jwt-decode';

interface RegistrationResponse {
  token: string;
}

export const userRegistration = async (
  login: string,
  password: string,
  role: string
): Promise<any> => {
  try {
    const { data }: AxiosResponse<RegistrationResponse> = await $host.post('api/user/registration', {
      login,
      password,
      role,
    });
    return jwtDecode(data.token);
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } else {
      return 500;
    }
  }
};

interface LoginResponse {
  token: string;
}

export const loginFunc = async (login: string, password: string): Promise<any> => {
  try {
    const { data }: AxiosResponse<LoginResponse> = await $host.post('api/user/login', { login, password });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
  } catch (error: any) {
    console.log(error);
  }
};

export const auth = async (): Promise<any> => {
  try {
    const { data }: AxiosResponse<LoginResponse> = await $authHost.post('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
  } catch (error: any) {
    console.log(error);
  }
};
