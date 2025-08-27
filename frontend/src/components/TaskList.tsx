import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasks, updateTaskStatus, deleteTask, updateTask } from "../api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openSections, setOpenSections] = useState({
    PENDING: true,
    IN_PROGRESS: true,
    COMPLETED: true,
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
    }
  };

  const handleStatusChange = async (id: number, status: Task["status"] | "NONE") => {
    if (status === "NONE") return;
    try {
      await updateTaskStatus(id, status);
      await fetchTasks();
      setError(null);
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Failed to update task status.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      await fetchTasks();
      setError(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task.");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id!);
    setEditedTask({ title: task.title, description: task.description, dueDateTime: task.dueDateTime });
  };

  const handleSave = async (id: number) => {
    try {
      await updateTask(id, editedTask);
      setEditingTaskId(null);
      setEditedTask({});
      await fetchTasks();
      setError(null);
    } catch (err) {
      console.error("Failed to save task:", err);
      setError("Failed to save task.");
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedTask({});
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
    const isEditing = task.id === editingTaskId;

    return (
      <li key={task.id} style={{ marginBottom: "1rem" }}>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedTask.title || ""}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Title"
            />
            <input
              type="datetime-local"
              value={editedTask.dueDateTime || ""}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, dueDateTime: e.target.value }))}
            />
            <textarea
              value={editedTask.description || ""}
              onChange={(e) => setEditedTask((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
            />
            <button onClick={() => handleSave(task.id!)}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div>
            <strong>{task.title}</strong> - Due: {task.dueDateTime}
            <p>{task.description}</p>

            {task.status === "PENDING" && (
              <button onClick={() => handleStatusChange(task.id!, "IN_PROGRESS")}>
                Start Task
              </button>
            )}
            {task.status === "IN_PROGRESS" && (
              <>
                <button onClick={() => handleStatusChange(task.id!, "COMPLETED")}>✅</button>
                <button onClick={() => handleStatusChange(task.id!, "PENDING")}>Move Back to Pending</button>
              </>
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
            <button onClick={() => handleEdit(task)}>Edit</button>
          </div>
        )}
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
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
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
            {openSections[status] && <ul>{groupedTasks[status].map(renderTask)}</ul>}
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;
