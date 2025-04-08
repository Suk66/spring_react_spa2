package com.example.zzyzzy.semiprojectv2.controller;


import com.example.zzyzzy.semiprojectv2.domain.Pds;
import com.example.zzyzzy.semiprojectv2.domain.PdsReplyDTO;
import com.example.zzyzzy.semiprojectv2.service.PdsService;
import com.example.zzyzzy.semiprojectv2.utils.GoogleRecaptchaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/pds")
@CrossOrigin(origins={"http://localhost:5173", "http://localhost:3000"})
public class PdsController {

    @Value("${savePdsDir}") private String savePdsDir;
    private final PdsService pdsService;
    private final GoogleRecaptchaService googleRecaptchaService;


    @GetMapping("/view/{pno}")
    public ResponseEntity<?> view(@PathVariable int pno) {
        PdsReplyDTO rdsreply = pdsService.readOnePdsReply(pno);

        return new ResponseEntity<>(rdsreply, HttpStatus.OK);
    }

    @PostMapping("/write")
    public ResponseEntity<?> writeok(Pds pds, List<MultipartFile>panames,
                                 @RequestParam("g-recaptcha-response") String gRecaptchaResponse) {
        ResponseEntity<?> response = ResponseEntity.internalServerError().build();
        log.info("submit된 자료실 정보1 : {}" , pds);
        log.info("submit된 자료실 정보2 : {}" , panames);

        try {
            if (!googleRecaptchaService.verifyRecaptcha(gRecaptchaResponse)) {
                throw new IllegalStateException("자동가입방지 코드 오류!!");
            }

            if (pdsService.newPds(pds, panames)) {
                response = ResponseEntity.ok().body("파일 업로드 성공!!");
            }
        } catch (IllegalStateException ex) {
            response = ResponseEntity.badRequest().body(ex.getMessage());
        }

        return response;
    }

    @GetMapping("/down/{fname}")
    public ResponseEntity<?> down(@PathVariable String fname) {
        // 다운로드할 실제 파일 경로를 알아냄
        File file = new File(savePdsDir + fname);
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("파일이 존재하지 않습니다!!");
        }

        HttpHeaders headers = new HttpHeaders();
        // 다운로드시 저장할 파일명 지정
        headers.setContentDisposition(ContentDisposition.attachment().filename(fname).build());
        // 다운로드시 다운로드할 파일의 유형 지정 - 다운로드 대화상자가 무조건 뜨도록 OCTET_STREAM으로 설정
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(new FileSystemResource(file), headers, HttpStatus.OK);
    }

}
