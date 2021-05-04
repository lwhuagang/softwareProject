package com.software_project.vo;

import com.software_project.pojo.Hold;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class HoldVO {

    private double hold; // 持有金额
    private String userEmail;
    private String fundCode;
    private double holdProfit; // 持有收益
    private double yesProfit; // 昨日收益
    private double holdCost; // 持有成本
    private double share; // 持有份额
    private double holdProfitRate; // 持有收益率
    private double perHoldCost; // 持仓成本价
    private List<String> totalProfit; // 三十天累计收益
}
