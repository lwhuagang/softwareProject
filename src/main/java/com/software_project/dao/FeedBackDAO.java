package com.software_project.dao;

import com.software_project.pojo.Browse;
import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Search;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface FeedBackDAO {
    /**
     * 插入一条
     * @param feedBack 待插入的反馈记录
     */
    void insertFeedBack(FeedBack feedBack);

    /**
     * 查询所有的反馈记录
     * @return 返回所有的反馈记录
     */
    List<FeedBack> findAllFeedBack();

    /**
     * 查询所有尚未解决的反馈
     * @return 返回所有尚未解决的反馈
     */
    List<FeedBack> getAllFDNo();

    /**
     * 查询所有解决的反馈
     * @return 返回所有尚未解决的反馈
     */
    List<FeedBack> getAllFDyes();

    /**
     * 处理用户的反馈，用于反馈的更新
     * @param feedBack 处理之后的反馈
     */
    void updateFD(FeedBack feedBack);

}
