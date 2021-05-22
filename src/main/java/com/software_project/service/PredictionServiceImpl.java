package com.software_project.service;

import com.software_project.dao.PredictionDAO;
import com.software_project.pojo.Prediction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredictionServiceImpl implements PredictionService {
    @Autowired
    private PredictionDAO predictionDAO;

    @Override
    public Prediction getPreByFundCode(String fundCode) {
        return predictionDAO.getPreByFundCode(fundCode);
    }

    @Override
    public List<Prediction> getAllPrediction(int startIndex, int pageSize) {
        return predictionDAO.getAllPrediction(startIndex, pageSize);
    }
}
