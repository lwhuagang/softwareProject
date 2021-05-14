package com.software_project.service;

import com.software_project.dao.CommentDAO;
import com.software_project.pojo.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentDAO commentDAO;

    @Override
    public void insertComment(Comment comment) {
        commentDAO.insertComment(comment);
    }

    @Override
    public void deleteComment(int id) {
        commentDAO.deleteComment(id);
    }

    @Override
    public List<Comment> getCommentsByFundCode(String fundCode) {
        return commentDAO.getCommentsByFundCode(fundCode);
    }

    @Override
    public List<Comment> getRespondCommentsByID(int id) {
        return commentDAO.getRespondCommentsByID(id);
    }
}
