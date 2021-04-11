package com.software_project.service;

import com.software_project.controller.Result;

public interface FundService {
    /**
     * 调用外部接口获取基金的详细信息
     * @param fundCode 基金代码
     * @return  result类 包含状态码、基金的详细信息、附加信息
     */
    Result getFundDetail(String fundCode);
}
