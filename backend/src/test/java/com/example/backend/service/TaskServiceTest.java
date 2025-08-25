package com.example.backend.service;

import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
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
        task.setTitle("Old Task");
        task.setStatus(Task.Status.PENDING);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.updateStatus(1L, Task.Status.COMPLETED);

        assertThat(result.getStatus()).isEqualTo(Task.Status.COMPLETED);
        verify(taskRepository, times(1)).save(task);
    }
}
