package com.bzdata.gestimospringbackend.utility;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component

public class Scheduler {
   int timer=5000;
   @Scheduled(fixedDelay = 5000)
   public void Scheduler() {
      LocalDateTime current= LocalDateTime.now();
      DateTimeFormatter format=DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
      String formattedDateTime=current.format(format);
     // log.info("Sheduler time-----> {}",formattedDateTime);
      
   }
  
   
}
