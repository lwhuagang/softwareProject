package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Hold {
    private double hold; // 持有金额
    private String userEmail;
    private String fundCode;
    private double holdProfit; // 持有收益
    private double yesProfit; // 昨日收益
    private double holdCost; // 持有成本
    private double share; // 持有份额
}