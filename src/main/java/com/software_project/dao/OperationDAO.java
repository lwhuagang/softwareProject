package com.software_project.dao;

import com.software_project.pojo.Record;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface OperationDAO {
    /**
     * 将交易记录插入到record表中
     * @param record 待插入交易记录
     */
    void insertDeal(Record record);


    /**
     * @param money 用户买入该基金金额(未扣除手续费)
     */
    void subMoney(String email, double money);
}
