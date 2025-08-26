package com.example.backend.repository;

import com.example.backend.model.Task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
	List<Task> findByStatus(Task.Status status);
}
