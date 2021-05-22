package com.software_project.dao;

import com.software_project.pojo.Prediction;
import com.software_project.pojo.Record;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface PredictionDAO {

    Prediction getPreByFundCode(String fundCode);

    List<Prediction> getAllPrediction(@Param("startIndex") int startIndex, @Param("pageSize") int pageSize);


}
