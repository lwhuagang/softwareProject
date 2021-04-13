package com.software_project.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("fund")
public class FundController {

    @ResponseBody
    @GetMapping("details")
    public Object queryFundDetails(String code, @RequestParam(name = "startDate", required = false) String startDate, @RequestParam(name = "endDate", required = false) String endDate) {
        RestTemplate restTemplate = new RestTemplate();
        String s;
        if (startDate == null && endDate == null) {
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code, String.class);
        }
        else if (startDate != null && endDate != null) {
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=" + startDate + "&endDate=" +endDate, String.class);
        }
        else if (startDate != null) {
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=" + startDate, String.class);
        }
        else {
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&endDate=" + endDate, String.class);
        }
        Object parse = JSONObject.parse(s);
        // return new Result(200,parse,"返回根据输入条件搜索的结果");
        return parse;
    }

}
