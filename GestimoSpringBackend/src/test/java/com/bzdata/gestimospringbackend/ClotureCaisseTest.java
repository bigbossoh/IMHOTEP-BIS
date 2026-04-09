package com.bzdata.gestimospringbackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;


@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
// @Testcontainers
public class ClotureCaisseTest {

  @Autowired
  private MockMvc mockMvc;

  // @Container
  // static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.1.0");

  // @DynamicPropertySource
  // static void dynamicConfiguration(DynamicPropertyRegistry registry) {
  //   registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
  //   registry.add("spring.datasource.username", mySQLContainer::getUsername);
  //   registry.add("spring.datasource.password", mySQLContainer::getPassword);
  // }
}
