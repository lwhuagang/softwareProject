package com.software_project.service;

import com.software_project.dao.FeedBackDAO;
import com.software_project.pojo.FeedBack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedBackServiceImpl implements FeedBackService{

    @Autowired
    private FeedBackDAO feedBackDAO;

    @Override
    public void insertFeedBack(FeedBack feedBack) {
        feedBackDAO.insertFeedBack(feedBack);
    }

    @Override
    public List<FeedBack> findAllFeedBack() {
        return feedBackDAO.findAllFeedBack();
    }

    @Override
    public List<FeedBack> getAllFDNo() {
        return feedBackDAO.getAllFDNo();
    }

    @Override
    public List<FeedBack> getAllFDyes() {
        return feedBackDAO.getAllFDyes();
    }

    @Override
    public void updateFD(FeedBack feedBack) {
        feedBackDAO.updateFD(feedBack);
    }

    @Override
    public void deleteFeedBack(String userEmail) {
        feedBackDAO.deleteFeedBack(userEmail);
    }
}
