package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Fund {
    // fund表属性
    private String code;
    private String name;
    private String type;
    private double buyMin;
    private double buySourceRate;
    private double buyRate;
    private String manager;
    // hold表属性
    private double hold;
    private String userEmail;
    private String fundCode;
    private double holdProfit;
    // 计算属性
    // 昨日收益
    private double yesProfit;
    private double yesRate;
    // 持有收益率
    private double rate;
}
