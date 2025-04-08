package com.example.zzyzzy.semiprojectv2.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

@Entity
@Table(name="pds_attach3")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PdsAttach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pano;

    @Column(nullable = false)
    private String pafname;

    @Column(nullable = false)
    private int pafsize;

    private int pafdown = 0;

    @Column(nullable = false)
    private int pno;
}
