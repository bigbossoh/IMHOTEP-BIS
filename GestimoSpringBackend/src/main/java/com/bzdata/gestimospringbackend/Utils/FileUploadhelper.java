package com.bzdata.gestimospringbackend.Utils;
import static com.bzdata.gestimospringbackend.constant.FileConstant.USER_FOLDER;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;



@Component
public class FileUploadhelper {
   public final String UPLOAD_DIR=USER_FOLDER+"/images";
   public boolean uploadFile(MultipartFile multipartFile){
      boolean f=false;
      try{
         InputStream is =multipartFile.getInputStream();
         byte data[]=new byte[is.available()];
         is.read(data);
         //write
         FileOutputStream fos=new FileOutputStream(UPLOAD_DIR+File.separator+multipartFile.getOriginalFilename());
         fos.write(data);
         fos.flush();
         fos.close();
         f=true;
      }catch( Exception e){
         e.printStackTrace();
      }

      return f;
   }
}
