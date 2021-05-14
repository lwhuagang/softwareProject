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

    @Override
    public Fund insertFund(Fund fund) {
        fundDAO.insertFund(fund);
        return fund;
    }

    @Override
    public void deleteFund(int fundCode) {
        fundDAO.deleteFund(fundCode);
    }

    @Override
    public int getFundsNum() {
        return fundDAO.getFundsNum();
    }

    @Override
    public List<Fund> getAllFunds() {
        return fundDAO.getAllFunds();
    }

    @Override
    public List<Fund> getFundsByPage(int startIndex, int pageSize) {
        return fundDAO.getFundsByPage(startIndex, pageSize);
    }
}
