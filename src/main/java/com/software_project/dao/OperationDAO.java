package com.software_project.dao;

import com.software_project.pojo.Record;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface OperationDAO {
    /**
     * 将交易记录插入到record表中
     * @param record 待插入交易记录
     */
    void insertDeal(Record record);

    void updateDeal(Record record);

    List<Record> getAllUndoRecord();

    void deleteOp(String email);
}
