package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class User {
    private String email;
    private String password;
    private String nickname;
    private double money;
    private String pic_url;
    private double hold_profit;
    private double total_profit;
}
