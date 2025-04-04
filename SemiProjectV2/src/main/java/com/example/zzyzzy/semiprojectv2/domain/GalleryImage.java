package com.example.zzyzzy.semiprojectv2.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import javax.persistence.*;

@Entity
@Table(name="gallery_images3")
@Data @Builder
@AllArgsConstructor
@NoArgsConstructor
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int gno;

    @Column(nullable = false)
    private String imgname;

    @Column(nullable = false)
    private int imgsize;
}
