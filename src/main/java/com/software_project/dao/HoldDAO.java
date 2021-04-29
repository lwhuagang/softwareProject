package com.software_project.dao;

import com.software_project.pojo.Hold;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

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

    /**
     * 根据用户email和fundcode得到对应的hold关系
     * @param email 用户email
     * @param fundCode 用户购买的基金代码
     * @return hold关系
     */
    Hold getHoldByUserEmailAndFundCode(@Param("email") String email, @Param("fundCode") String fundCode);
}
