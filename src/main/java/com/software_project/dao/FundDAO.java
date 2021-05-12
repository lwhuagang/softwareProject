package com.software_project.dao;

import com.software_project.pojo.Fund;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface FundDAO {

    /**
     * @param fund 待插入的基金
     */
    void insertFund(Fund fund);

    /**
     * @param code 待查询基金的代码
     * @return 根据代码进行基金查询
     */
    Fund searchByCode(int code);

    /**
     * @param name 待查询基金的代码
     * @return 根据基金名称进行基金查询
     */
    List<Fund> searchByName(String name);

    /**
     * @param email 用户id
     * @return 返回该用户持有的基金列表.
     */
    List<Fund> holdFund(String email);


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
    List<Fund> getFundsByPage(@Param("startIndex") int startIndex, @Param("pageSize") int pageSize);
}
