package com.software_project.service;

import com.software_project.pojo.Record;

import java.util.List;

public interface RecordService {
    /**
     * 获取用户的所有交易记录
     * @param userEmail 用户的邮箱
     * @param fundCode  基金代码
     * @return 符合条件的交易记录
     */
    List<Record> getRecords(String userEmail, String fundCode);

    /**
     * 查找用户的所有的交易记录
     * @param userEmail 用户的邮箱
     * @return  符合条件的交易记录
     */
    List<Record> getRecordsByUserEmail(String userEmail);

    /**
     * 删除一条未完成的记录
     * @param record 交易记录
     */
    void deleteOneRecord(Record record);



}
