import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasks, updateTaskStatus, deleteTask } from "../api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await getTasks(); // fetch ALL tasks
    setTasks(res.data);
  };

  const handleStatusChange = async (id: number, status: Task["status"]) => {
    await updateTaskStatus(id, status);
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderTask = (task: Task) => (
    <li key={task.id}>
      <strong>{task.title}</strong> - Due: {task.dueDateTime}
      <select
        value={task.status}
        onChange={(e) =>
          handleStatusChange(task.id!, e.target.value as Task["status"])
        }
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <button onClick={() => handleDelete(task.id!)}>Delete</button>
      <p>{task.description}</p>
    </li>
  );

  const groupedTasks = {
    PENDING: tasks.filter((t) => t.status === "PENDING"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };

  return (
    <div>
      <h2>Pending Tasks</h2>
      <ul>{groupedTasks.PENDING.map(renderTask)}</ul>

      <h2>In Progress Tasks</h2>
      <ul>{groupedTasks.IN_PROGRESS.map(renderTask)}</ul>

      <h2>Completed Tasks</h2>
      <ul>{groupedTasks.COMPLETED.map(renderTask)}</ul>
    </div>
  );
};

export default TaskList;
