package com.software_project.dao;

import com.software_project.pojo.Attention;
import com.software_project.pojo.Fund;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import sun.java2d.pipe.AAShapePipe;

import java.util.List;

@Repository
@Mapper
public interface AttentionDAO {
    /**
     * 关注基金
     * @param attention 待插入的关注条目（email， fundCode）
     */
    void insertAttention(Attention attention);

    /**
     * 取消关注
     * @param attention 待删除的关注条目
     */
    void deleteAttention(Attention attention);

    /**
     * 获取用户的关注列表
     * @param email 用户邮箱
     * @return 关注列表中的所有基金信息
     */
    List<Fund> watchList(String email);
}
