package com.escola.api;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository
        extends JpaRepository<Aluno, Long> {
}