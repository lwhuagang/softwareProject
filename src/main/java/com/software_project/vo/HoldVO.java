package com.software_project.vo;

import com.software_project.pojo.Fund;
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

    // 基金的基本信息
    private String name;
    private String type;
    private double buyMin;  // buyMin 起购额度
    private double buySourceRate;   // 原始的买入费率
    private double buyRate;         // 当前的买入费率
    private String manager;         // 基金经理
    private double netWorth;        // 基金净值
    // 和用户相关的持有信息
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

    private double toVerifyMoney;     // 持有金额+未完成的交易中的金额

    public HoldVO(String userEmail, Fund fund, Hold hold) {
        this.userEmail = userEmail;
        this.fundCode = fund.getFundCode();

        this.name = fund.getName();
        this.type = fund.getType();
        this.buyMin = fund.getBuyMin();
        this.buySourceRate = fund.getBuySourceRate();
        this.buyRate = fund.getBuyRate();
        this.manager = fund.getManager();
        this.netWorth = fund.getNetWorth();
        if (hold != null) {
            this.hold = hold.getHold();
            this.holdProfit = hold.getHoldProfit();
            this.yesProfit = hold.getYesProfit();
            this.holdCost = hold.getHoldCost();
            this.share = hold.getShare();

            this.holdProfitRate = hold.getHoldProfit() / hold.getHoldCost() * 100;
            this.perHoldCost = hold.getHoldCost() / hold.getShare();
        }
    }
}
