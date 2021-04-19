package com.software_project.service;

import com.software_project.dao.HoldDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HoldServiceImpl  implements HoldService{
    @Autowired
    private HoldDAO holdDAO;

    public void updateHoldHH(String email, String fundCode, double hold, double holdProfit) {
        holdDAO.updateHoldHH(email, fundCode, hold, holdProfit);
    }
}
