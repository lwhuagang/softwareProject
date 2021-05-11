package com.software_project.service;

import com.software_project.pojo.Hold;

public interface HoldService {
    /**
     * 更新hold中基金的hold和holdProfit
     * @param email         用户id
     * @param fundCode      基金代码
     * @param hold          用户在该基金上的持有量
     * @param holdProfit    用户在该基金上的持有收益
     * @param yesProfit     用户在该基金上的昨日收益
     */
    void updateHoldHH(String email, String fundCode, double hold, double holdProfit, double yesProfit);

    /**
     * 根据用户email和fundcode得到对应的hold关系
     * @param email 用户email
     * @param fundCode 用户购买的基金代码
     * @return hold关系
     */
    Hold getHoldByUserEmailAndFundCode(String email,String fundCode);


    /**
     * 更新hold对象
     * @param hold hold
     */
    void updateHold(Hold hold);

    void insertHold(Hold hold);

    void deleteHold(String email);
}
