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
public class Comment {
    private int id;
    private String userEmail;
    private String nickname;
    private String fundCode;
    private String comment;
    private Date time;
    private int toCommentID;
}
