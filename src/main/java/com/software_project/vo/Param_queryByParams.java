package com.software_project.vo;

import java.util.Arrays;

/**
 * 筛选条件的参数包装类
 */
public class Param_queryByParams {
    public String[] fundType;
    public String sort;

    @Override
    public String toString() {
        return "{" +
                "fundType='" + Arrays.toString(fundType) + '\'' +
                ", sort='" + sort + '\'' +
                '}';
    }
}
