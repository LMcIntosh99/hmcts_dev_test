import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasks, updateTaskStatus, deleteTask } from "../api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openSections, setOpenSections] = useState({
    PENDING: true,
    IN_PROGRESS: true,
    COMPLETED: true,
  });

  const fetchTasks = async () => {
    const res = await getTasks(); // fetch ALL tasks
    setTasks(res.data);
  };

  const handleStatusChange = async (id: number, status: Task["status"] | "NONE") => {
    if (status === "NONE") return; // do nothing if "Change status" is chosen
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

  const toggleSection = (status: Task["status"]) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const renderTask = (task: Task) => {
    return (
      <li key={task.id}>
        <strong>{task.title}</strong> - Due: {task.dueDateTime}
        {task.status === "PENDING" && (
          <button onClick={() => handleStatusChange(task.id!, "IN_PROGRESS")}>
            Start Task
          </button>
        )}
        {task.status === "IN_PROGRESS" && (
          <button onClick={() => handleStatusChange(task.id!, "COMPLETED")}>
            Complete Task
          </button>
        )}
        {task.status === "COMPLETED" && (
          <select
            onChange={(e) =>
              handleStatusChange(task.id!, e.target.value as Task["status"] | "NONE")
            }
            defaultValue="NONE"
          >
            <option value="NONE">Change status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        )}
        <button onClick={() => handleDelete(task.id!)}>Delete</button>
        <p>{task.description}</p>
      </li>
    );
  };

  const groupedTasks = {
    PENDING: tasks.filter((t) => t.status === "PENDING"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };

  const statusLabels: Record<Task["status"], string> = {
    PENDING: "Pending Tasks",
    IN_PROGRESS: "In Progress Tasks",
    COMPLETED: "Completed Tasks",
  };

  return (
    <div>
      {(["PENDING", "IN_PROGRESS", "COMPLETED"] as Task["status"][]).map(
        (status) => (
          <div key={status}>
            <h2
              onClick={() => toggleSection(status)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "8px" }}>
                {openSections[status] ? "▼" : "▶"}
              </span>
              {statusLabels[status]}
            </h2>
            {openSections[status] && (
              <ul>{groupedTasks[status].map(renderTask)}</ul>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;
