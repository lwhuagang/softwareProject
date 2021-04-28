package com.software_project.controller;

import com.software_project.pojo.Fund;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Record;
import com.software_project.pojo.User;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.OperationService;
import com.software_project.service.UserService;
import com.software_project.vo.Param_Buy;
import com.software_project.vo.Param_Sell;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@RestController
@RequestMapping("fundOperation")
public class OperationController {
    @Autowired
    UserService userService;

    @Autowired
    OperationService operationService;

    @Autowired
    FundService fundService;

    @Autowired
    HoldService holdService;

    /**
     * 主要实现将用户购买操作存入到record表中,等待晚上统一处理
     * 并对用户直接扣款
     * @param params 传入用户邮箱,基金代码,购入金额
     * @return 是否成功记录该用户购买该基金操作
     */
    @PostMapping("buy")
    public Result buy(@RequestBody Param_Buy params) {
        try {
            String email = params.getEmail();
            String fundCode = params.getFundCode();
            double money = params.getMoney();
            User user = userService.findUserByEmail(email);
            Fund fund = fundService.searchFundByCode(Integer.parseInt(fundCode));
            if (money >= user.getMoney() || money < fund.getBuyMin()) {
                throw new Exception("买入金额输入有误,需满足范围");
            }
            Record record = new Record();
            record.setUserEmail(email);
            record.setFundCode(fundCode);
            record.setType(false);//false 代表 买入,true 代表 卖出
            Timestamp goodsC_date = Timestamp.valueOf(addDateMinut(8));//把时间转换
            record.setTime(goodsC_date);
            record.setFlag(false);//true 该交易已处理,false 未处理
            record.setCount(money);
            operationService.insertDeal(record);
            // 扣除用户金额
            user.setBuyMoney(user.getMoney() - money);
            userService.updateUser(user);
            return new Result(200, true, "买入操作记录成功");
        }
        catch (Exception e){
            return new Result(200, false, "买入操作记录失败");
        }
    }

    @PostMapping("sell")
    public Result sell(@RequestBody Param_Sell params) throws Exception {
        try {
            String email = params.getEmail();
            String fundCode = params.getFundCode();
            double share = params.getSellShare();
            Hold hold = holdService.getHoldByUserEmailAndFundCode(email, fundCode);
            if (share < 0.01 || share > hold.getShare()){
                throw new Exception("卖出份额输入有误,需满足范围");
            }
            Record record = new Record();
            record.setUserEmail(email);
            record.setFundCode(fundCode);
            record.setType(true);//false 代表 买入,true 代表 卖出
            Timestamp goodsC_date = Timestamp.valueOf(addDateMinut(8));//把时间转换
            record.setTime(goodsC_date);
            record.setFlag(false);//true 该交易已处理,false 未处理
            record.setCount(share);
            operationService.insertDeal(record);
            return new Result(200, true, "卖出操作记录成功");
        }
        catch (Exception e){
            throw e;
            //return new Result(200, false, "卖出操作记录失败");
        }
    }

    /**
     * 更新买入卖出相关数据
     * @return 返回是否更新成功
     */
    @GetMapping("update")
    public static Result update(){

    }

    public static String addDateMinut(int hour){
        Date date = new Date();//获得系统时间.
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("front:" + sdf.format(date)); //显示输入的日期
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.HOUR, hour);// 24小时制
        date = cal.getTime();
        System.out.println("after:" + sdf.format(date));  //显示更新后的日期
        return sdf.format(date);
    }
}
