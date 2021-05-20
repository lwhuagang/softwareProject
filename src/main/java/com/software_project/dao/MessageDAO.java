package com.software_project.dao;

import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface MessageDAO {

    /**
     * 插入一条待推送消息: 这里插入的是一条基金推送的消息
     * @param message 待插入的消息
     */
    void insertMessageOne(Message message);

    /**
     * 插入一条消息： 这里插入的是一条反馈的消息
     * @param feedBack 待插入的消息
     */
    void insertMessageTwo(FeedBack feedBack);

    /**
     * 获取所有未推送的消息
     * @param userEmail 用户邮箱
     * @return 未推送的消息列表
     */
    List<Message> getNotReadMessage(String userEmail);

    /**
     * 清空所有的未读消息， 改变read字段未true
     * @param userEmail 用户邮箱
     */
    void clearNotReadMessage(String userEmail);

}
