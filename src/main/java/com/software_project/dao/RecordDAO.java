package com.software_project.dao;

import com.software_project.pojo.Record;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface RecordDAO {

    List<Record> getRecords(@Param("userEmail") String userEmail, @Param("fundCode") String fundCode);
}
