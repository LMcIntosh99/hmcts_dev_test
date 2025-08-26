import React from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  const [refresh, setRefresh] = React.useState(false);

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm onTaskCreated={() => setRefresh(!refresh)} />
      <TaskList key={refresh ? 1 : 0} />
    </div>
  );
}

export default App;
