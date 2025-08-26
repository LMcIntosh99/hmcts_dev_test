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

  return (
    <div>
      <ul>
        <h2>Pending Tasks</h2>
        {pendingTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - Due:{" "}
            {task.dueDateTime}
            <button
              onClick={() =>
                handleStatusChange(task.id!, nextStatus(task.status))
              }
            >
              Start Task
            </button>
            <button onClick={() => handleDelete(task.id!)}>Delete</button>
            <p>{task.description}</p>
          </li>
        ))}
        <h2>In Progress Tasks</h2>
        {inProgressTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - Due:{" "}
            {task.dueDateTime}
            <button
              onClick={() =>
                handleStatusChange(task.id!, nextStatus(task.status))
              }
            >
              Complete Task
            </button>
            <button onClick={() => handleDelete(task.id!)}>Delete</button>
            <p>{task.description}</p>
          </li>
        ))}
        <h2>Completed Tasks</h2>
        {completedTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>
            <button
              onClick={() =>
                handleStatusChange(task.id!, nextStatus(task.status))
              }
            >
              Toggle Status
            </button>
            <button onClick={() => handleDelete(task.id!)}>Delete</button>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
