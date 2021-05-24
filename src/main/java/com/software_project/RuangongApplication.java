package com.software_project;

import com.software_project.controller.UserController;
import com.software_project.pojo.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.ParseException;
import java.util.List;

@SpringBootApplication
@EnableScheduling
//@MapperScan(value = "com.software_project.dao")
//@ComponentScan(value = "com.software_project.pojo")
public class RuangongApplication {

    public static void main(String[] args) {
        SpringApplication.run(RuangongApplication.class, args);
    }
}
