import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasksByStatus, updateTaskStatus, deleteTask } from "../api";

const TaskList: React.FC = () => {
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res1 = await getTasksByStatus("PENDING");
    setPendingTasks(res1.data);

    const res2 = await getTasksByStatus("IN_PROGRESS");
    setInProgressTasks(res2.data);

    const res3 = await getTasksByStatus("COMPLETED");
    setCompletedTasks(res3.data);
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

  const nextStatus = (status: Task["status"]) => {
    switch (status) {
        case "PENDING":
        return "IN_PROGRESS";
        case "IN_PROGRESS":
        return "COMPLETED";
        case "COMPLETED":
        return "PENDING";
    }
  };  

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

  return (
    <div>
      <h2>Pending Tasks</h2>
      <ul>{pendingTasks.map(renderTask)}</ul>

      <h2>In Progress Tasks</h2>
      <ul>{inProgressTasks.map(renderTask)}</ul>

      <h2>Completed Tasks</h2>
      <ul>{completedTasks.map(renderTask)}</ul>
    </div>
  );
};

export default TaskList;
