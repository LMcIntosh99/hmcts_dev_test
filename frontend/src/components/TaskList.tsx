import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasks, updateTaskStatus, deleteTask } from "../api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await getTasks();
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
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status} - Due:{" "}
            {task.dueDateTime}
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
