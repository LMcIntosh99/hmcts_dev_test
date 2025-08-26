package com.example.backend.service;

import com.example.backend.exception.TaskNotFoundException;
import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

class TaskServiceTest {

    private TaskRepository taskRepository;
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskRepository = mock(TaskRepository.class);
        taskService = new TaskService(taskRepository);
    }

    @Test
    void testCreateTask() {
    	LocalDateTime testDueDateTime = LocalDateTime.now();
        Task task = new Task();
        task.setTitle("Test Task");
        task.setStatus(Task.Status.PENDING);
        task.setDueDateTime(testDueDateTime);

        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.createTask(task);

        assertThat(result.getTitle()).isEqualTo("Test Task");
        assertThat(result.getDescription()).isEqualTo(null);
        assertThat(result.getDueDateTime()).isEqualTo(testDueDateTime);
        assertThat(result.getStatus()).isEqualTo(Task.Status.PENDING);
        verify(taskRepository, times(1)).save(task);
    }
    
    @Test
    void testUpdateStatus() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setStatus(Task.Status.PENDING);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.updateStatus(1L, Task.Status.COMPLETED);

        assertThat(result.getStatus()).isEqualTo(Task.Status.COMPLETED);
        verify(taskRepository, times(1)).save(task);
    }
    
    @Test
    void testUpdateStatus_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateStatus(1L, Task.Status.COMPLETED))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    void testGetTaskById() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Task> result = taskService.getTaskById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getTitle()).isEqualTo("Test Task");
        verify(taskRepository, times(1)).findById(1L);
    }
    
    @Test
    void testGetTaskById_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.getTaskById(99L);

        assertThat(result).isNotPresent();
        verify(taskRepository, times(1)).findById(99L);
    }
    
    @Test
    void testGetAllTasks() {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        when(taskRepository.findAll()).thenReturn(List.of(task1, task2));

        List<Task> result = taskService.getAllTasks();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(Task::getTitle)
                          .containsExactly("Task 1", "Task 2");
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void testDeleteTask() {
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }
    
    @Test
    void testGetTasksByStatus() {
    	Task task = new Task();
        task.setId(1L);
        task.setTitle("Completed Task");
        task.setStatus(Task.Status.COMPLETED);
        
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("In Progress Task");
        task2.setStatus(Task.Status.IN_PROGRESS);
        
        Task task3 = new Task();
        task3.setId(3L);
        task3.setTitle("Completed Task 2");
        task3.setStatus(Task.Status.COMPLETED);

        List<Task> completedTasks = List.of(task, task3);

        when(taskRepository.findByStatus(Task.Status.COMPLETED)).thenReturn(completedTasks);

        List<Task> result = taskService.getTasksByStatus(Task.Status.COMPLETED);

        assertThat(result)
            .hasSize(2)
            .extracting(Task::getTitle)
            .containsExactly("Completed Task", "Completed Task 2");

        verify(taskRepository, times(1)).findByStatus(Task.Status.COMPLETED);
    }
    
    @Test
    void testUpdateTask() {
    	Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setStatus(Task.Status.PENDING);
        task.setDueDateTime(LocalDateTime.now());

        LocalDateTime newDueDate = LocalDateTime.of(2025, 10, 26, 12, 0);
        Task updatedTask = task;
        updatedTask.setTitle("New Task Title");
        updatedTask.setDescription("Updated description");
        updatedTask.setDueDateTime(newDueDate);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(updatedTask)).thenReturn(updatedTask);
        
        Task result = taskService.updateTask(1L, updatedTask);

        assertThat(result.getTitle()).isEqualTo("New Task Title");
        assertThat(result.getDescription()).isEqualTo("Updated description");
        assertThat(result.getStatus()).isEqualTo(Task.Status.PENDING);
        assertThat(result.getDueDateTime()).isEqualTo(newDueDate);
        verify(taskRepository, times(1)).save(task);
    }

    
    @Test
    void testUpdateTask_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.updateTask(1L, new Task()))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found");

        verify(taskRepository, never()).save(any(Task.class));
    }
}
