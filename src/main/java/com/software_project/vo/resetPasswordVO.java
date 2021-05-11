package com.software_project.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class resetPasswordVO {
    private String email;
    private String password;
    private String captcha;
}
