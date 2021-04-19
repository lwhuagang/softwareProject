package com.software_project.dao;

import com.software_project.pojo.Fund;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface HoldDAO {
    /**
     *
     * @param email         用户id
     * @param fundCode      基金代码
     * @param hold          用户在该基金上的持有量
     * @param holdProfit    用户在该基金上的持有收益
     */
    void updateHoldHH(@Param("email") String email, @Param("fundCode") String fundCode, @Param("hold") double hold, @Param("holdProfit") double holdProfit);
}
