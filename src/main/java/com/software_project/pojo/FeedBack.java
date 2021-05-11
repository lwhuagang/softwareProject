package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class FeedBack {
    private String userEmail;
    private String message;
    private String result;
    private boolean flag;
    private Date time;
}
