import axios from "axios";
import { Task } from "./types";

const API_URL = "http://localhost:8080/api/tasks";

export const getTasks = () => axios.get<Task[]>(API_URL);

export const getTaskById = (id: number) => axios.get<Task>(`${API_URL}/${id}`);

export const createTask = (task: Task) => axios.post<Task>(API_URL, task);

export const updateTaskStatus = (id: number, status: Task["status"]) =>
  axios.patch<Task>(`${API_URL}/${id}/status`, null, { params: { status } });

export const deleteTask = (id: number) => axios.delete(`${API_URL}/${id}`);

export const getTasksByStatus = (status: Task["status"]) =>
    axios.get<Task[]>(`${API_URL}/status/${status}`);
