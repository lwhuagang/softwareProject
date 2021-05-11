package com.software_project.dao;

import com.software_project.pojo.Record;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface RecordDAO {
    /**
     * 获取用户的所有交易记录
     * @param userEmail 用户的邮箱
     * @param fundCode  基金代码
     * @return 符合条件的交易记录
     */
    List<Record> getRecords(@Param("userEmail") String userEmail, @Param("fundCode") String fundCode);

    /**
     * 查找用户的所有的交易记录
     * @param userEmail 用户的邮箱
     * @return  符合条件的交易记录
     */
    List<Record> getRecordsByUserEmail(String userEmail);
}
