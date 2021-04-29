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
    private double netWorth;
    // hold表属性
    private double hold;
    private String userEmail;
    private String fundCode;
    private double holdProfit;
    private double yesProfit; // 昨日收益
    private double holdCost;
    private double share;
    // 计算属性
    private double rate; // 持有收益率
    private double yesRate; // 昨日收益率

}
