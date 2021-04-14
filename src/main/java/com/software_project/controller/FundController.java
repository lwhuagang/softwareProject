package com.software_project.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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
        return new Result(200,parse,"返回根据输入条件搜索的结果");
        // return parse;
    }

    /**
     * 按筛选条件进行基金列表返回,使用restTemplate进行第三方url接口调用
     * @param params 传入参数 基金类型 时长
     * @return 返回调用第三方接口获取的基金筛选列表
     */
    @ResponseBody
    @PostMapping("queryByParams")
    public Result queryByParams(@RequestBody UserController.Param_queryByParams params){

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

}
