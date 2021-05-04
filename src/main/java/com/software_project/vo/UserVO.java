package com.software_project.vo;

import com.software_project.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO{
    private String email;
    private String password;
    private String nickname;
    private double money;
    private String picUrl;
    private boolean admin;
    private double holdProfit;
    private double totalProfit;
    private double buyMoney;
    private double initMoney;
    private double dayProfit;
    private double holdCost;

    private double holdProfitRate; //总持有收益率
    private double propertyProfitRate; //资产收益率

    public UserVO(User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.nickname = user.getNickname();
        this.money = user.getMoney();
        this.picUrl = user.getPicUrl();
        this.admin = user.isAdmin();
        this.holdProfit = user.getHoldProfit();
        this.totalProfit = user.getTotalProfit();
        this.buyMoney = user.getBuyMoney();
        this.initMoney = user.getInitMoney();
        this.dayProfit = user.getDayProfit();
        this.holdCost = user.getHoldCost();
    }
}
