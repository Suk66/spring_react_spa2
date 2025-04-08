package com.example.zzyzzy.semiprojectv2.repository;

import com.example.zzyzzy.semiprojectv2.domain.PdsReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface PdsReplyRepository extends JpaRepository<PdsReply, Long> {
    ArrayList<PdsReply> findByPno(int pno);
}
