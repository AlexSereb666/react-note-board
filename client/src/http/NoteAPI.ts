import { AxiosResponse } from 'axios';
import { $authHost } from './index';

// Интерфейс для ответа от сервера при добавлении заметки
export interface AddNoteResponse {
  // Поля, которые сервер может вернуть
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  x: number;
  y: number;
}

// Функция для добавления заметки
export const addNote = async (
  id: number,
  title: string,
  description: string,
  date: string,
  userId: number,
  x: number,
  y: number
): Promise<AddNoteResponse> => {
  try {
    const { data }: AxiosResponse<AddNoteResponse> = await $authHost.post('api/note', {
      id,
      title,
      description,
      date,
      userId,
      x,
      y,
    });
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// Функция для получения всех заметок пользователя
export const getNotes = async (userId: number): Promise<AddNoteResponse[]> => {
  try {
    const { data }: AxiosResponse<AddNoteResponse[]> = await $authHost.get(`api/note/${userId}`);
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// Функция для обновления заметки
export const updateNote = async (
  id: number,
  title: string,
  description: string,
  date: string,
  x: number,
  y: number
): Promise<AddNoteResponse> => {
  try {
    const { data }: AxiosResponse<AddNoteResponse> = await $authHost.put(`api/note/${id}`, {
      title,
      description,
      date,
      x,
      y,
    });
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

// Функция для удаления заметки
export const deleteNote = async (id: number): Promise<{ message: string }> => {
  try {
    const { data }: AxiosResponse<{ message: string }> = await $authHost.delete(`api/note/${id}`);
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
