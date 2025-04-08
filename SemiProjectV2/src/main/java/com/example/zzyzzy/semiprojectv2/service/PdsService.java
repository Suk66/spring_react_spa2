package com.example.zzyzzy.semiprojectv2.service;

import com.example.zzyzzy.semiprojectv2.domain.Pds;
import com.example.zzyzzy.semiprojectv2.domain.PdsReplyDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PdsService {
    boolean newPds(Pds pds, List<MultipartFile> panames);

    PdsReplyDTO readOnePdsReply(int pno);
}
