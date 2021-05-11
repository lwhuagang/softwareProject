package com.software_project.service;

import com.software_project.pojo.Fund;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface FundService {

    /**
     * 根据用户邮箱查询到该用户持有的所有基金
     * @param email 传入的用户email
     * @return 封装为result返回
     */
    List<Fund> getHoldFund(String email);

    /**
     * 根据基金名称进行对基金进行模糊查询
     * @param name 基金名称
     * @return 将查询到的基金列表封装为result返回
     */
    List<Fund> searchFundByName(String name);

    /**
     * 根据基金代码进行对基金进行精准
     * @param code 基金代码
     * @return 将查询到的基金列表封装为result返回
     */
    Fund searchFundByCode(int code);

    /**
     * 插入新的基金
     * @param fund 待插入的基金
     * @return 待插入的基金信息
     */
    Fund insertFund(Fund fund);

    /**
     * 删除基金
     * @param fundCode 基金代码
     */
    void deleteFund(int fundCode);

    /**
     * 查询数据库中基金的数目
     * @return 数据库中基金的数目
     */
    int getFundsNum();

    /**
     * 查询数据库里面所有得基金信息
     * @return 数据库中所有的基金信息
     */
    List<Fund> getAllFunds();

    /**
     * 根据页面索引和页面大小查询数据库中对应的基金信息（实现分页操作）
     * @param pageIndex 页面索引
     * @param pageSize 页面大小
     * @return 部分的基金信息
     */
    List<Fund> getFundsByPage(@Param("pageIndex") int pageIndex, @Param("pageSize") int pageSize);
}
