package com.example.backend.controller;

import com.example.backend.exception.TaskNotFoundException;
import com.example.backend.model.Task;
import com.example.backend.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateTask() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("New Task");
        task.setStatus(Task.Status.PENDING);
        task.setDueDateTime(LocalDateTime.now());

        when(taskService.createTask(any(Task.class))).thenReturn(task);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Task"));
    }
    
    @Test
    void testDeleteTask() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("New Task");
        task.setStatus(Task.Status.PENDING);
        task.setDueDateTime(LocalDateTime.now());

        when(taskService.createTask(any(Task.class))).thenReturn(task);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk());

        doNothing().when(taskService).deleteTask(task.getId());

        mockMvc.perform(delete("/api/tasks/{id}", task.getId()))
                .andExpect(status().isOk());

        verify(taskService, times(1)).deleteTask(task.getId());
    }


    @Test
    void testGetTask() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("New Task");

        when(taskService.getTaskById(1L)).thenReturn(Optional.of(task));

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Task"));
    }
    
    @Test
    void testGetTask_NotFound() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isNotFound())
                .andExpect(result -> assertThat(result.getResolvedException())
                        .isInstanceOf(TaskNotFoundException.class)
                        .hasMessage("Task not found"));

        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    void testGetAllTasks() throws Exception {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");

        when(taskService.getAllTasks()).thenReturn(List.of(task1, task2));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Task 1"))
                .andExpect(jsonPath("$[1].title").value("Task 2"));
    }
    
    @Test
    void testUpdateStatus() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("New Task");
        task.setStatus(Task.Status.PENDING);
        task.setDueDateTime(LocalDateTime.now());

        Task updatedTask = new Task();
        updatedTask.setId(1L);
        updatedTask.setTitle("New Task");
        updatedTask.setStatus(Task.Status.COMPLETED);
        updatedTask.setDueDateTime(task.getDueDateTime());

        when(taskService.updateStatus(eq(task.getId()), eq(Task.Status.COMPLETED)))
                .thenReturn(updatedTask);

        mockMvc.perform(patch("/api/tasks/{id}/status", task.getId())
                .param("status", "COMPLETED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(task.getId()))
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.status").value("COMPLETED"));

        verify(taskService, times(1)).updateStatus(task.getId(), Task.Status.COMPLETED);
    }
    
    @Test
    void testGetTasksByStatus() throws Exception {
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
        when(taskService.getTasksByStatus(Task.Status.COMPLETED)).thenReturn(Optional.of(completedTasks));

        mockMvc.perform(get("/api/tasks/status/{status}", "COMPLETED"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].title").value("Completed Task"))
        .andExpect(jsonPath("$[1].title").value("Completed Task 2"));
    }
    
}
