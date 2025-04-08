package com.example.zzyzzy.semiprojectv2.domain;

import

        lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="pds3")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Pds {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pno;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String userid;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contents;

    @Column(nullable = false)
    private int thumbs = 0;

    @Column(nullable = false)
    private int views = 0;

    @CreationTimestamp
    private LocalDateTime regdate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno")
    private List<PdsAttach> pdsAttach = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno")
    private List<PdsReply> pdsReply = new ArrayList<>();
}
