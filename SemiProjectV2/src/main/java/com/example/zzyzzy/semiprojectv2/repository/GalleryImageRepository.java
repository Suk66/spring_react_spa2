package com.example.zzyzzy.semiprojectv2.repository;

import com.example.zzyzzy.semiprojectv2.domain.GalleryImage;
import com.example.zzyzzy.semiprojectv2.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {

}
