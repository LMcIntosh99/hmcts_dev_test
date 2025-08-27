package com.example.backend.controller;

import com.example.backend.exception.TaskNotFoundException;
import com.example.backend.model.Task;
import com.example.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Create Task
    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.createTask(task);
    }

    // Get Task by ID
    @GetMapping("/{id}")
    public Task getTask(@PathVariable("id") Long id) {
        return taskService.getTaskById(id).orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }
    

    // Get All Tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Update Status
    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable("id") Long id, @RequestParam("status") Task.Status status) {
        return taskService.updateStatus(id, status);
    }

    // Delete Task
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long id) {
        taskService.deleteTask(id);
    }

    // Get Tasks by Status
    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable("status") Task.Status status) {
        return taskService.getTasksByStatus(status);
    }
    
    @PatchMapping("/{id}")
    public Task updateTask(@PathVariable("id") Long id, @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask);
    }


}
