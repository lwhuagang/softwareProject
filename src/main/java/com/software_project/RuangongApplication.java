package com.software_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@MapperScan(value = "com.software_project.dao")
//@ComponentScan(value = "com.software_project.pojo")
public class RuangongApplication {

    public static void main(String[] args) {
        SpringApplication.run(RuangongApplication.class, args);
    }

}
