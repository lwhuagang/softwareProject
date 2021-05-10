package com.software_project.dao;

import com.software_project.pojo.Fund;
import org.apache.ibatis.annotations.Mapper;
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
}
