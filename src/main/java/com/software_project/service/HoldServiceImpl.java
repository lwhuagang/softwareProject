package com.software_project.service;

import com.software_project.dao.HoldDAO;
import com.software_project.pojo.Hold;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HoldServiceImpl implements HoldService{
    @Autowired
    private HoldDAO holdDAO;

    @Override
    public void updateHoldHH(String email, String fundCode, double hold, double holdProfit, double yesProfit) {
        holdDAO.updateHoldHH(email, fundCode, hold, holdProfit, yesProfit);
    }

    @Override
    public Hold getHoldByUserEmailAndFundCode(String email, String fundCode) {
        return holdDAO.getHoldByUserEmailAndFundCode(email,fundCode);
    }

    @Override
    public void updateHold(Hold hold) {
        holdDAO.updateHold(hold);
    }

    @Override
    public void insertHold(Hold hold) {
        holdDAO.insertHold(hold);
    }

    @Override
    public void deleteHold(String email) {
        holdDAO.deleteHold(email);
    }


}
