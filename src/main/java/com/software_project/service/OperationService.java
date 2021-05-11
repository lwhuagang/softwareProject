package com.software_project.service;

import com.software_project.pojo.Record;

import java.util.List;

public interface OperationService {
    /**
     * 保存交易记录,在当天晚上统一处理
     * 如果有交易记录则直接更新
     * @param record 交易记录
     */
    void insertDeal(Record record);

    /**
     * 获取所有没有处理的交易记录,以便后续更新
     * @return 交易记录列表
     */
    List<Record> getAllUndoRecord();

    void deleteOperation(String email);
}
