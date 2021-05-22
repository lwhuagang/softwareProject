package com.software_project.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Fund;
import com.software_project.pojo.Message;
import com.software_project.pojo.Prediction;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.MessageService;
import com.software_project.service.PredictionService;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RequestMapping("message")
@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private PredictionService predictionService;    // 负责获取基金预测的相关信息

    @Autowired
    private HoldService holdService;

    @Autowired
    private FundService fundService;

    @PostMapping("insertFundMsg")
    public Result insertFundMsg(@RequestBody Message message) {
        messageService.insertMessageOne(message);
        return new Result(200, message, "插入一条基金清仓/补仓的消息");
    }

    @GetMapping("addFundMsg")
    public Result addFundMsg2(String userEmail) {
        addFundMsg(userEmail);
        return new Result(200, true, "添加基金加仓、清仓消息");
    }


//    public Result insertFundBackMsg(FeedBack feedBack) {
//        messageService.insertMessageTwo(feedBack);
//        return new Result(200, feedBack, "插入一条处理反馈的消息");
//    }

    @GetMapping("getAllNotReadMsg")
    public Result getAllNotReadMsg(String userEmail){
        // addFundMsg(userEmail);      // 添加有关基金加仓、清仓的消息，基金推送消息的处理已转成定时任务

        List<Message> messages = messageService.getNotReadMessage(userEmail);
        List<Message> ret_messages = new ArrayList<>(); // 基金推送消息必须要是在今天的消息才会被推送，之前的一概不管
        for (Message message : messages) {
            if (message.getMessageType() == 0 && getMinusDay(message.getTime()) <= 1) {
                ret_messages.add(message);
                // System.out.println(message.getFundName());
            }
        }
        return new Result(200, ret_messages, "获取所有未读的消息");
    }

    private int getMinusDay(Date date) {
        Calendar cal1 = Calendar.getInstance(); // 当前时间
        cal1.setTime(date);

        Calendar cal2 = Calendar.getInstance();
        //cal2.setTime(date);
        int day1= cal1.get(Calendar.DAY_OF_YEAR);
        int day2 = cal2.get(Calendar.DAY_OF_YEAR);

        int year1 = cal1.get(Calendar.YEAR);
        int year2 = cal2.get(Calendar.YEAR);
        if(year1 != year2)   //同一年
        {
            int timeDistance = 0 ;
            for(int i = year1 ; i < year2 ; i ++)
            {
                if(i%4==0 && i%100!=0 || i%400==0)    //闰年
                {
                    timeDistance += 366;
                }
                else    //不是闰年
                {
                    timeDistance += 365;
                }
            }

            return timeDistance + (day2-day1) ;
        }
        else    //不同年
        {
            // System.out.println("判断day2 - day1 : " + (day2-day1));
            return day2-day1;
        }
    }

    @GetMapping("clearAllNotReadMsg")
    public Result clearAllNotReadMsg(String userEmail){
        messageService.clearNotReadMessage(userEmail);
        return new Result(200, true, "清除所有未读消息");
    }

    @GetMapping("getAllReadMessage")
    public Result getAllReadMessage(String userEmail) {
        List<Message> allReadMessage = messageService.getAllReadMessage(userEmail);
        return new Result(200, allReadMessage, "获取该用户的所有已读信息");
    }

    @GetMapping("getAllMessage")
    public Result getAllMessage(String userEmail) {
        List<Message> allReadMessage = messageService.getAllMessage(userEmail);
        return new Result(200, allReadMessage, "获取该用户的所有信息");
    }

    @GetMapping("deleteAllMessage")
    public Result deleteAllMessage(String userEmail) {
        messageService.deleteAllMessage(userEmail);
        return new Result(200, true, "删除该用户的所有信息");
    }

    private double lastWorthRate(String fundCode){       // 用于判断是否需要进行加仓，true表示需要进行加仓，false表示需要清仓
        Prediction preByFundCode = predictionService.getPreByFundCode(fundCode);
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

    public double getFundWorth(String fundCode) {
        RestTemplate restTemplate = new RestTemplate();
        String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + fundCode, String.class);
        JSONObject jsonObject = JSON.parseObject(s);
        JSONObject data =(JSONObject) jsonObject.get("data");
        // 可能会存在基金没有净值的情况
        try {
            return Double.parseDouble(data.getString("netWorth"));   // 基金的单位净值
        }
        catch (Exception e) {
            return 0;
        }
    }

    private void addFundMsg(String userEmail) {     // 需要根据预测的结果向message表中填入相应的推送信息
        double range = 0.00;        // 阈值设置，只有当阈值的绝对指在range之外的时候才进行消息的推送
        List<Fund> holdFund = fundService.getHoldFund(userEmail);
        for (Fund fund : holdFund) {
            Message message = new Message();
            double lastRate = lastWorthRate(fund.getCode());    // 这个地方计算是涨幅不是净值
            if (lastRate > 1+ range) {
                message.setUserEmail(userEmail);
                message.setAddWarehouse(true);
                message.setFundCode(fund.getCode());
                // System.out.println(getFundName(fund.getCode()));
                message.setFundName(getFundName(fund.getCode()));
                // System.out.println(message.getFundName());
                message.setNetWorth(getFundWorth(fund.getCode()));
                message.setExpectWorth(message.getNetWorth()*lastRate);
                message.setNetWorthDate(new Date());            // 获取当前时间
                message.setExpectWorthDate(addDate(15));       // 当前时间加上十五天

                messageService.insertMessageOne(message);
            }
            else if (lastRate < 1 - range) {
                message.setUserEmail(userEmail);
                message.setAddWarehouse(false);
                message.setFundCode(fund.getCode());
                message.setNetWorth(getFundWorth(fund.getCode()));
                System.out.println(getFundName(fund.getCode()));
                message.setFundName(getFundName(fund.getCode()));
                System.out.println(message.getFundName());
                message.setExpectWorth(message.getNetWorth()*lastRate);
                message.setNetWorthDate(new Date());            // 获取当前时间
                message.setExpectWorthDate(addDate(15));       // 当前时间加上十五天

                messageService.insertMessageOne(message);
            }
        }

    }
    public static Date addDate (int num) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, num);
        Date date = calendar.getTime();
        return date;
    }

    protected String getFundName(String fundCode) {
        Fund fund = fundService.searchFundByCode(Integer.parseInt(fundCode));
        return fund.getName();
    }



}
