package com.example.zzyzzy.semiprojectv2.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="gallerys3")
@Data @Builder
@AllArgsConstructor
@NoArgsConstructor
public class Gallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ggno;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String userid;

    @Column(nullable = false)
    private String simgname;

    @Column
    private int thumbs = 0;

    @Column
    private int views = 0;

    @Column(nullable = false)
    private String contents;

    @CreationTimestamp
    private LocalDateTime regdate;
}
