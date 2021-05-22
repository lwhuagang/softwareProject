package com.software_project.service;

import com.software_project.pojo.Prediction;

import java.util.List;

public interface PredictionService {
    Prediction getPreByFundCode(String fundCode);

    List<Prediction> getAllPrediction();

}
