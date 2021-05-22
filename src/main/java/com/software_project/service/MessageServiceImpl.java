package com.software_project.service;

import com.software_project.dao.HoldDAO;
import com.software_project.dao.MessageDAO;
import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService{
    @Autowired
    private MessageDAO messageDAO;

    @Override
    public void insertMessageOne(Message message) {
        messageDAO.insertMessageOne(message);
    }

    @Override
    public void insertMessageTwo(FeedBack feedBack) {
        messageDAO.insertMessageTwo(feedBack);
    }

    @Override
    public List<Message> getNotReadMessage(String userEmail) {
        return messageDAO.getNotReadMessage(userEmail);
    }

    @Override
    public void clearNotReadMessage(String userEmail) {
        messageDAO.clearNotReadMessage(userEmail);
    }

    @Override
    public List<Message> getAllReadMessage(String userEmail) {
        return messageDAO.getAllReadMessage(userEmail);
    }

    @Override
    public List<Message> getAllMessage(String userEmail) {
        return messageDAO.getAllMessage(userEmail);
    }

    @Override
    public void deleteAllMessage(String userEmail) {
        messageDAO.deleteAllMessage(userEmail);
    }
}
