package com.software_project.service;

import com.software_project.pojo.Attention;
import com.software_project.pojo.Fund;

import java.util.List;

public interface AttentionService {
    /**
     * 添加关注基金
     * @param attention 插入条目
     */
    void addWatch(Attention attention);

    /**
     * 取消关注
     * @param attention 删除条目
     */
    void deleteWatch(Attention attention);

    /**
     * 获取用户的自选列表
     * @param email 用户邮箱
     * @return 用户自选列表中所有基金信息
     */
    List<Fund> getWatchList(String email);

}
