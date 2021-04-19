package com.software_project.service;

public interface HoldService {
    /**
     * 更新hold中基金的hold和holdProfit
     * @param email         用户id
     * @param fundCode      基金代码
     * @param hold          用户在该基金上的持有量
     * @param holdProfit    用户在该基金上的持有收益
     */
    void updateHoldHH(String email, String fundCode, double hold, double holdProfit);
}
