package com.example.zzyzzy.semiprojectv2.service;

import com.example.zzyzzy.semiprojectv2.domain.Pds;
import com.example.zzyzzy.semiprojectv2.domain.PdsAttach;
import com.example.zzyzzy.semiprojectv2.domain.PdsReply;
import com.example.zzyzzy.semiprojectv2.domain.PdsReplyDTO;
import com.example.zzyzzy.semiprojectv2.repository.PdsAttachRepository;
import com.example.zzyzzy.semiprojectv2.repository.PdsReplyRepository;
import com.example.zzyzzy.semiprojectv2.repository.PdsRepository;
import com.example.zzyzzy.semiprojectv2.utils.PdsUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdsServiceImpl implements PdsService {

    private final PdsRepository pdsMapper;
    private final PdsAttachRepository pdsAttachMapper;
    private final PdsReplyRepository pdsReplyMapper;
    private final PdsUploadService pdsUploadService;

    public boolean newPds(Pds pds, List<MultipartFile> panames) {
        boolean result = false;

        // 작성한 게시글을 pds에 저장하고, 생성된 글번호를 알아냄
        int pno = -999;
        try {
            // jpa를 이용해서 방금 입력한 데이터의 id 추출
            Pds newOne = pdsMapper.save(pds);
            pno = newOne.getPno();
        } catch (Exception ex) {
            throw new IllegalStateException("insertPds 오류발생!!");
        }

        // 첨부된 파일들을 업로드 처리하고
        // 알아낸 글번호로 첨부된 파일들에 대한 정보를 pds_attach에 저장
        List<PdsAttach> pas = null;
        if (!panames.isEmpty()) {
            try {
                // 업로드 처리후 업로드된 파일들의 정보를 리스트형태로 받아옴
                pas = pdsUploadService.processUpload(panames, pno);
            } catch (Exception ex) {
                throw new IllegalStateException("processUpload 오류발생!!");
            }
            // 업로드된 파일의 정보를 pds_attach 테이블에 저장
            // 즉, 첨부된 파일정보를 개별 행으로 저장
            try {
                // jpa를 이용해서 List 형식의 데이터를 한번에 테이블에 저장
                pdsAttachMapper.saveAll(pas);
            } catch (Exception e) {
                throw new IllegalStateException("insertPdsAttach 오류발생!!");
            }
            result = true;
        }
        return result;
    }

    @Transactional
    @Override
    public PdsReplyDTO readOnePdsReply(int pno) {
        Pds pds = pdsMapper.findByPno(pno);
        List<PdsAttach> pas = pdsAttachMapper.findByPno(pno);
        List<PdsReply> prs = pdsReplyMapper.findByPno(pno);

        return new PdsReplyDTO(pds, pas, prs);
    }


}
