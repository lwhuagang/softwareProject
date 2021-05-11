package com.software_project.service;

import com.software_project.dao.AttentionDAO;
import com.software_project.pojo.Attention;
import com.software_project.pojo.Fund;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttentionServiceImpl implements AttentionService {
    private final AttentionDAO attentionDAO;

    public AttentionServiceImpl(AttentionDAO attentionDAO) {
        this.attentionDAO = attentionDAO;
    }

    @Override
    public void addWatch(Attention attention) {
        attentionDAO.insertAttention(attention);
    }

    @Override
    public void deleteWatch(Attention attention) {
        attentionDAO.deleteAttention(attention);
    }

    @Override
    public List<Fund> getWatchList(String email) {
        return attentionDAO.watchList(email);
    }

    @Override
    public void deleteAtt(String email) {
        attentionDAO.deleteUserAttention(email);
    }


}
