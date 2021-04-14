package com.software_project.controller;

import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.Fund;
import com.software_project.service.FundService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RequestMapping("fund")
@RestController
public class FundController {
    @Autowired
    private FundService fundService;


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
        return new Result(200,parse,"返回基金详细信息");
        // return parse;
    }

    /**
     * 按筛选条件进行基金列表返回,使用restTemplate进行第三方url接口调用
     * @param params 传入参数 基金类型 时长
     * @return 返回调用第三方接口获取的基金筛选列表
     */
    @PostMapping("queryByParams")
    public Result queryByParams(@RequestBody Param_queryByParams params){

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/json");
        headers.setContentType(type);
        headers.add("token","atTPd9c8sA");

        JSONObject param = new JSONObject();
        param.put("fundType", params.fundType);
        param.put("sort", params.sort);

        HttpEntity<JSONObject> formEntity = new HttpEntity<>(param,headers);

        String s = restTemplate.postForObject("https://api.doctorxiong.club/v1/fund/rank", formEntity, String.class);
        Object parse = JSONObject.parse(s);
        return new Result(200,parse,"返回根据输入条件搜索的结果");
    }

    /**
     * 筛选条件的参数包装类
     */
    static class Param_queryByParams {
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

    /**
     * @param params 传入参数code或者是name
     * @return 返回按name模糊查询基金列表or按code精准查询基金
     */
    @PostMapping("searchFund")
    public Result searchFund(@RequestBody Param_searchFund params){
        if (params.code == 0 && !params.name.equals("")){
            // 按名字查找
            List<Fund> funds = fundService.searchFundByName(params.name);
            return new Result(200,funds,"按名字查找基金列表");
        }
        else if(params.code != 0 && params.name.equals("")){
            // 按代码查找
            Fund fund = fundService.searchFundByCode(params.code);
            return new Result(200,fund,"按代码查找基金");
        }
        else {
            return new Result(200,null,"没有搜索条件!");
        }
    }

    /**
     * 筛选条件的参数包装类
     */
    @Data
    static class Param_searchFund {
        public int code;
        public String name;
    }
}
