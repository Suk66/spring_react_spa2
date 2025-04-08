package com.example.zzyzzy.semiprojectv2.utils;


import com.example.zzyzzy.semiprojectv2.domain.PdsAttach;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PdsUploadService {

    // 첨부파일 저장위치
    @Value("${savePdsDir}") private String savePdsDir;

    public List<PdsAttach> processUpload(List<MultipartFile> panames, int pno) {
    List<PdsAttach> pas = new ArrayList<>();

    for ( MultipartFile paname : panames) {
        // 업로드할 파일 정보 알아내기 - 첨부파일명
        String fname = makeUUID() + paname.getOriginalFilename();

        // 업로드할 파일 정보 알아내기 - 파일 크기
        int fsize = (int) (paname.getSize() / 1024);

        // 첨부파일을 지정한 위치에 저장
        String savepath = savePdsDir + fname;

        try {
            // 임시폴더에 저장된 업로드 예정 파일을 지정한 위치에 저장
            paname.transferTo(new File(savepath));

            // 첨부파일 정보를 클래스객체로 만들어 리스트에 저장
            pas.add(PdsAttach.builder()
                    .pafsize(fsize).pafname(fname).pno(pno).build());
        } catch (IOException e) {
            log.error("첨부파일 처리중 오류발생!!");
            e.printStackTrace();
        }
    }
    return pas;
    }

    private String makeUUID() {
        String uuid = LocalDate.now() + "" + LocalTime.now();
        uuid = uuid.replace("-", "")
                .replace(":", "")
                .replace(".", "");

        return uuid;
    }

}
