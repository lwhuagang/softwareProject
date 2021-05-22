package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
public class Prediction implements Comparable<Prediction>{
    private String fundCode;
    private String fundName;
    private double day1;
    private double day2;
    private double day3;
    private double day4;
    private double day5;
    private double day6;
    private double day7;
    private double day8;
    private double day9;
    private double day10;
    private double day11;
    private double day12;
    private double day13;
    private double day14;
    private double day15;
    private double lastRate;

    @Override
    public int compareTo(Prediction o) {
        return ((o.getLastRate() - this.getLastRate())>0)? 1:-1;     // 如何相减的结果大于0表示1、小于0表示0
    }
}
