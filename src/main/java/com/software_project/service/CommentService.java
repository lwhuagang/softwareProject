package com.software_project.service;

import com.software_project.pojo.Comment;

import java.util.List;

public interface CommentService {
    /**
     * 插入一条评论
     * @param comment 待插入的评论
     */
    void insertComment(Comment comment);        // 这个其实是可以实现回复的

    /**
     * 删除一条评论
     * @param id  待删除的评论的ID，在删除的时前端可以检查一下是否为对应的用户，或者是否有管理员的权限
     */
    void deleteComment(int id);

    /**
     * 获取一个基金下的所有的评论
     * @param fundCode  基金代码
     * @return  该基金下的所有的评论
     */
    List<Comment> getCommentsByFundCode(String fundCode);

    /**
     * 获取某个评论下的所有的恢复
     * @param id 评论id
     * @return  该评论下所有的回复
     */
    List<Comment> getRespondCommentsByID(int id);

    /**
     * 获取一个用户的所有评论
     * @param userEmail 用户邮箱
     * @return 该用户的所有评论
     */
    List<Comment> getCommentByUserEmail(String userEmail);
}
