package com.software_project.service;

import com.software_project.pojo.Record;

public interface OperationService {
    /**
     * 保存交易记录,在当天晚上统一处理
     * @param record 交易记录
     */
    void insertDeal(Record record);

    /**
     * 将用户可用金额减去其买入金额
     * @param email 用户id
     * @param money 用户买入金额
     */
    void subMoney(String email,double money);
}
