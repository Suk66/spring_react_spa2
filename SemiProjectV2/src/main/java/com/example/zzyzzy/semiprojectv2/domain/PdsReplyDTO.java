package com.example.zzyzzy.semiprojectv2.domain;

import lombok.Data;

import java.util.List;

@Data
public class PdsReplyDTO {
    private Pds pds;
    private List<?> pas;
    private List<?> rps;

    public PdsReplyDTO(Pds pds, List<?> pas, List<?> rps) {
        this.pds = pds;
        this.pas = pas;
        this.rps = rps;
    }

}
