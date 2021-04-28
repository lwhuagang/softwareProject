package com.software_project.service;

import com.software_project.pojo.Fund;

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


}
