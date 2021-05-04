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
    private double buyMin;  // buyMin 起购额度
    private double buySourceRate;   // 原始的买入费率
    private double buyRate;         // 当前的买入费率
    private String manager;         // 基金经理
    private double netWorth;        // 基金净值
    // hold表属性
    private double hold;            // 该用户该基金的持有金额
    private String userEmail;
    private String fundCode;
    private double holdProfit;      //该基金持有收益
    private double yesProfit; // 该基金昨日收益
    private double holdCost;    // 该基金持有成本
    private double share;       // 该基金持有份额
    // 计算属性
    private double rate; // 持有收益率
    private double yesRate; // 昨日收益率

}
