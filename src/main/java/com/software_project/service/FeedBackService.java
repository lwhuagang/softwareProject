package com.software_project.service;

import com.software_project.pojo.FeedBack;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface FeedBackService {

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

    /**
     * 删除用户的反馈记录
     * @param userEmail 用户邮箱
     */
    void deleteFeedBack(String userEmail);

    FeedBack getFeedBack(String userEmail, Date time);

}
