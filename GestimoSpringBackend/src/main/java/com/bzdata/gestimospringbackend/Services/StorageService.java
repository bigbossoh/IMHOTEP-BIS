package com.bzdata.gestimospringbackend.Services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String uploadImage(MultipartFile file) throws IOException;
    byte[] downloadImage(String fileName);
    // String uploadImageToFileSystem(MultipartFile file) throws IOException;
    // byte[] downloadImageFromFileSystem(String fileName) throws IOException;
}
