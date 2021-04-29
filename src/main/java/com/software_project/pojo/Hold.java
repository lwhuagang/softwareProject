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
    private double hold;
    private String userEmail;
    private String fundCode;
    private double holdProfit;
    private double yesProfit; // 昨日收益
    private double holdCost;
    private double share;
}
