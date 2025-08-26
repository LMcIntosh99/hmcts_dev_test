import React, { useState } from "react";
import { Task } from "../types";
import { createTask } from "../api";

interface Props {
  onTaskCreated: () => void;
}

const TaskForm: React.FC<Props> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [status, setStatus] = useState<Task["status"]>("PENDING");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({ title, description, status, dueDateTime });
    setTitle("");
    setDescription("");
    setDueDateTime("");
    setStatus("PENDING");
    onTaskCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={dueDateTime}
        onChange={(e) => setDueDateTime(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])}>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
