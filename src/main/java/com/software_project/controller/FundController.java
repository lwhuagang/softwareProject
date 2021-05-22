package com.software_project.controller;

import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.*;
import com.software_project.service.*;
import com.software_project.vo.HoldVO;
import com.software_project.vo.Param_queryByParams;
import com.software_project.vo.Param_searchFund;
import com.software_project.vo.Param_userAndFund;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@RequestMapping("fund")
@RestController
public class FundController {
    @Autowired
    private FundService fundService;

    @Autowired
    private AttentionService attentionService;

    @Autowired
    private HoldService holdService;

    @Autowired
    StringRedisTemplate redisTemplate;

    @Autowired
    private RecordService recordService;

    @Autowired
    private PredictionService predictionService;

    /**
     * 调用外部接口获取基金的详细信息
     * @param code 基金代码 startDate 开始时间（不必须） endDate 结束时间
     * @return  result类 包含状态码、基金的详细信息、附加信息
     */
    @GetMapping("details")
    public Result queryFundDetails(String code, @RequestParam(name = "startDate", required = false) String startDate, @RequestParam(name = "endDate", required = false) String endDate) {
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

    @PostMapping("addWatch")
    public Result addWatch(@RequestBody Attention attention) {
        attentionService.addWatch(attention);
        return new Result(200, attention, "关注条目内容");
    }


    @PostMapping("deleteWatch")
    public Result deleteWatch(@RequestBody Attention attention) {
        attentionService.deleteWatch(attention);
        return new Result(200, attention, "取消关注条目");
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

    @PostMapping("selfMsg")
    public Result getSelfMsg(@RequestBody Param_userAndFund params) {
        Fund fund = fundService.searchFundByCode(Integer.parseInt(params.fundCode));
        Hold hold = holdService.getHoldByUserEmailAndFundCode(params.userEmail, params.fundCode);
        HoldVO holdVO = new HoldVO(params.userEmail, fund, hold);
        holdVO.setTotalProfit(redisTemplate.opsForList().range(params.userEmail.substring(0,8)+":"+fund.getFundCode(), 0, -1));
        holdVO.setToVerifyMoney(getVerifyMoney(params.userEmail,  fund.getCode()));     // 设置待确认金额
        // 计算持有收益率
        return new Result(200, holdVO, "获取用户单个基金的资产详情");
    }

    @GetMapping("getFundsNum")
    public Result getFundsNum(){
        int num = fundService.getFundsNum();
        return new Result(200, num, "获取数据库中基金的个数");
    }


    @GetMapping("getAllFunds")
    public Result getAllFunds(){
        List<Fund> funds = fundService.getAllFunds();
        return new Result(200, funds, "获取数据库中所有的基金信息");
    }

    @GetMapping("getFundsByPage")
    public Result getFundsByPage(int pageIndex, int pageSize) {
        int startIndex = (pageIndex-1)*pageSize;
        List<Fund> funds = fundService.getFundsByPage(startIndex, pageSize);
        return new Result(200, funds, "按照页面获取数据库中基金信息");
    }

    @GetMapping("getAllPre")
    public Result getAllPre(int pageIndex, int pageSize) {     // 获取所有的ai推荐基金，涨幅排序之后的结果
        int startIndex = (pageIndex-1)*pageSize;
        List<Prediction> allPrediction = predictionService.getAllPrediction(startIndex, pageSize);
        List<Prediction> ret_prediction = new ArrayList<>();
        for (Prediction prediction : allPrediction) {
            if (getFundName(prediction.getFundCode()) != null) {
                prediction.setLastRate(lastWorthRate(prediction));
                prediction.setFundName(getFundName(prediction.getFundCode()));  //设置fundName
                ret_prediction.add(prediction);
            }
        }
        Collections.sort(allPrediction);
        return new Result(200, ret_prediction, "获取所有基金的AI预测排序结果，包括十五天的涨幅和最后一天的涨幅");
    }

    private String getFundName(String fundCode) {
//        System.out.println(fundCode);
        Fund fund = fundService.searchFundByCode(Integer.parseInt(fundCode));
//        System.out.println(fund);
        if (fund == null) {
            return null;
        }
        else {
            return fund.getName();
        }
    }

    private double lastWorthRate(Prediction prediction){       // 用于判断是否需要进行加仓，true表示需要进行加仓，false表示需要清仓
        Prediction preByFundCode = prediction;
        return (1+preByFundCode.getDay1()*0.01)
                *(1+preByFundCode.getDay2()*0.01)
                *(1+preByFundCode.getDay3()*0.01)
                *(1+preByFundCode.getDay4()*0.01)
                *(1+preByFundCode.getDay5()*0.01)
                *(1+preByFundCode.getDay6()*0.01)
                *(1+preByFundCode.getDay7()*0.01)
                *(1+preByFundCode.getDay8()*0.01)
                *(1+preByFundCode.getDay9()*0.01)
                *(1+preByFundCode.getDay10()*0.01)
                *(1+preByFundCode.getDay11()*0.01)
                *(1+preByFundCode.getDay12()*0.01)
                *(1+preByFundCode.getDay13()*0.01)
                *(1+preByFundCode.getDay14()*0.01)
                *(1+preByFundCode.getDay15()*0.01);
    }



    /**
     * 获取用户某个基金的待确认金额：未完成的交易记录中的金额
     * @param userEmail 用户邮箱
     * @param fundCode  基金代码
     * @return  用户在该基金上的待确认金额
     */
    private double getVerifyMoney(String userEmail, String fundCode) {
        List<Record> records = recordService.getRecords(userEmail, fundCode);
        double toVerifyMoney = 0;
        for (Record record : records) {
            if (!record.isFlag() && !record.isType()) {     // 买入并且没有被处理
                toVerifyMoney = toVerifyMoney + record.getCount();
            }
        }
        return toVerifyMoney;
    }







}
