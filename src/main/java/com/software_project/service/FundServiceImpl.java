package com.software_project.service;

import com.software_project.dao.FundDAO;
import com.software_project.pojo.Fund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FundServiceImpl implements FundService{
    @Autowired
    private FundDAO fundDAO;

    @Override
    public List<Fund> getHoldFund(String email) {
       return fundDAO.holdFund(email);
    }

    @Override
    public List<Fund> searchFundByName(String name) {
        return fundDAO.searchByName(name);
    }

    @Override
    public Fund searchFundByCode(int code) {
        return fundDAO.searchByCode(code);
    }
}