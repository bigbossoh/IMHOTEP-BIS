package com.bzdata.gestimospringbackend.Services.Impl;

import java.io.IOException;
import java.util.Optional;

import com.bzdata.gestimospringbackend.Models.ImageModel;
import com.bzdata.gestimospringbackend.Services.StorageService;
import com.bzdata.gestimospringbackend.Utils.ImageUtils;
import com.bzdata.gestimospringbackend.repository.ImageRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@Transactional
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageServiceImpl implements StorageService {
    final ImageRepository repository;
    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        ImageModel imageData=new ImageModel();
        imageData.setName(file.getOriginalFilename());
        imageData.setType(file.getOriginalFilename());
        //imageData.set(APP_ROOT +"/images/"+file.getOriginalFilename());
        imageData.setPicByte(ImageUtils.compressImage(file.getBytes()));
        repository.save(imageData);
        {
            return "file uploaded successfully : " + file.getOriginalFilename();
        }
    }

    @Override
    public byte[] downloadImage(String fileName) {
        Optional<ImageModel> dbImageData = repository.findByName(fileName);
        byte[] images=ImageUtils.decompressImage(dbImageData.get().getPicByte());
        return images;
    }

//     @Override
//     public String uploadImageToFileSystem(MultipartFile file) throws IOException {


//         String filePath=FOLDER_PATH+file.getOriginalFilename();
//         FileData fileData= new FileData();
//         fileData.setNameFileData(file.getOriginalFilename());
//         fileData.setTypeFileData(file.getContentType());
//         fileData.setFilePathFileData(filePath);
//         FileData save = fileDataRepository.save(fileData);
// //        FileData fileData=fileDataRepository.save(FileData.builder()
// //                .nameFileData(file.getOriginalFilename())
// //                .typeFileData(file.getContentType())
// //                .filePathFileData(filePath).build());

//         file.transferTo(new File(filePath));

//         if (fileData != null) {
//             return "file uploaded successfully : " + filePath;
//         }
//         return null;
//     }

    // @Override
    // public byte[] downloadImageFromFileSystem(String fileName) throws IOException {
    //     log.info("we are in downloadImageFromFileSystem");
    //     FileData fileData = fileDataRepository.findByNameFileData(fileName).orElse(null);
    //     if(fileData !=null){
    //         System.out.println("here is "+fileName);
    //     String filePath=fileData.getFilePathFileData();
    //     System.out.println(filePath);
    //     byte[] images = Files.readAllBytes(new File(filePath).toPath());
    //     log.info("file name {}",filePath);
    //     return images;}
    //     else{
    //         System.out.println("here is null "+fileName);
    //         return null;
    //     }
  //  }

}
