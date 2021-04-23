package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Attention {
    private String email;       // 用户邮箱
    private String fundCode;    // 基金代码
}
