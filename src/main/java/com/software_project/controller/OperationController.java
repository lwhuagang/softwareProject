package com.software_project.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.Fund;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Record;
import com.software_project.pojo.User;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.OperationService;
import com.software_project.service.UserService;
import com.software_project.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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

    @Autowired
    StringRedisTemplate redisTemplate;

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
            // 金额检查
            if (money >= user.getMoney() || money < fund.getBuyMin()) {  // buyMin 起购额度
                throw new Exception("买入金额输入有误,需满足范围");
            }

            // 创建交易记录：包括时间判断
            Record record = new Record();
            record.setUserEmail(email);
            record.setFundCode(fundCode);
            record.setType(false);//false 代表 买入,true 代表 卖出
            Timestamp goodsC_date = Timestamp.valueOf(addDateMinut());//把时间转换
            record.setTime(goodsC_date);
            record.setFlag(false);//true 该交易已处理,false 未处理
            record.setCount(money);
            // 判断交易时间在下午三点前还是三点后
            Date time = record.getTime();
            Calendar cal = Calendar.getInstance();
            cal.setTime(time);
            int hour = cal.get(Calendar.HOUR_OF_DAY);
            // false:不在当天交易,true:在当天交易
            record.setFlagTime(hour < 15);

            operationService.insertDeal(record);

            // 更新持有信息：该用户在该基金上的各种信息
            // 插入一个持有关系
            if (holdService.getHoldByUserEmailAndFundCode(email,fundCode) == null){
                holdService.insertHold(new Hold(0, email,fundCode,0,0,0,0));
            }

            // 更新用户信息
            // 扣除用户可用金额
            // 更新用户的总持有金额
            user.setMoney(user.getMoney() - money);
            userService.updateUser(user);
            return new Result(200, true, "买入操作记录成功");
        }
        catch (Exception e){
            e.printStackTrace();
            return new Result(200, false, "买入操作记录失败");
        }
    }

    @PostMapping("sell")
    public Result sell(@RequestBody Param_Sell params) {
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
            Timestamp goodsC_date = Timestamp.valueOf(addDateMinut());//把时间转换
            record.setTime(goodsC_date);
            record.setFlag(false);//true 该交易已处理,false 未处理
            record.setCount(share);

            // 判断交易时间在下午三点前还是三点后
            Date time = record.getTime();
            Calendar cal = Calendar.getInstance();
            cal.setTime(time);
            int hour = cal.get(Calendar.HOUR_OF_DAY);
            // false:不在当天交易,true:在当天交易
            record.setFlagTime(hour < 15);

            operationService.insertDeal(record);
            return new Result(200, true, "卖出操作记录成功");
        }
        catch (Exception e){
            return new Result(200, false, "卖出操作记录失败");
        }
    }

    /**
     * 更新买入卖出相关数据， 每天都需要调用的
     * @return 返回是否更新成功
     */
    @GetMapping("update")
    public Result update() throws ParseException {
        List<Record> records = operationService.getAllUndoRecord();
        RestTemplate restTemplate = new RestTemplate();
        for (Record record : records) {
            if (record.isFlag()) {
                continue; // 该条交易记录已处理
            }
            User user = userService.findUserByEmail(record.getUserEmail());
            Fund fund = fundService.searchFundByCode(Integer.parseInt(record.getFundCode()));
            Hold hold = holdService.getHoldByUserEmailAndFundCode(user.getEmail(),fund.getCode());

            if (!record.isFlagTime()){
                // 代表这个交易记录今日不处理,设置为true后跳过
                record.setFlagTime(true);
                operationService.insertDeal(record);
                continue;
            }
            String code = fund.getCode();
            String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
            JSONObject jsonObject = JSON.parseObject(s);
            JSONObject data =(JSONObject) jsonObject.get("data");
            String netWorthDate  = data.getString("netWorthDate");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = dateFormat.parse(netWorthDate);
            Date d=new Date();
            if (date.getYear() != d.getYear() || date.getMonth() != d.getMonth() || date.getDay() != d.getDay()) {
                // 说明是非交易日,直接跳过即可
                continue;
            }
            if (!record.isType()){
                // 买入操作更新数据定义
                double buyMoney = record.getCount(); // 用户买入金额
                double buyIn_fee = buyMoney * fund.getBuyRate() / 100; // 以当前买入费率为准,买入手续费
                double net_buyMoney = buyMoney - buyIn_fee; // 净买入金额
                // 获取当日净值
                double netWorth = Double.parseDouble(data.getString("netWorth"));
                // 买入份额计算
                double buyIn_share = net_buyMoney/netWorth;
                // 更新hold表          TODO 更新的信息是否完整
                //HoldVO hold_ret = new HoldVO();
                System.out.println(hold.getShare()+buyIn_share);
                hold.setShare(hold.getShare()+buyIn_share);

                System.out.println(hold.getHoldCost());
                System.out.println("net buyMoney:" + net_buyMoney);
                hold.setHoldCost(hold.getHoldCost()+net_buyMoney);
                hold.setHold(hold.getShare() * netWorth);
                // 更新基金累计收益
                Double total = Double.parseDouble(Objects.requireNonNull(redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getCode())));
                total -= buyIn_fee;
                redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), String.valueOf(total));  // TODO 什么意思
                holdService.updateHold(hold);
//                // 设置hold返回数据
//                hold_ret.setUserEmail(user.getEmail());
//                hold_ret.setFundCode(fund.getCode());
//                hold_ret.setHold(hold.getHold());
//                hold_ret.setShare(hold.getShare()+buyIn_share);
//                hold_ret.setHoldCost(hold.getHoldCost());
//                hold_ret.setHold(hold.getShare() * netWorth);
//                hold_ret.setHoldProfit(hold.getHold() - hold.getHoldCost());
//                hold_ret.setYesProfit(hold.getYesProfit());
//                hold_ret.setHoldProfitRate(hold_ret.getHoldProfit()/hold_ret.getHoldCost());
//                hold_ret.setTotalProfit(redisTemplate.opsForList().range(user.getEmail()+""+fund.getCode(), 0, -1));
                // 更新user表
                user.setBuyMoney(user.getBuyMoney()+net_buyMoney);
                user.setHoldCost(user.getHoldCost()+net_buyMoney);
                user.setTotalProfit(user.getTotalProfit() - buyIn_fee);
                userService.updateUser(user);           // TODO 这里是不是会不断的重复更新，应该可以在所有的信息都处理完毕之后一次性对用户的信息进行更新

                // 设置user返回数据
//                UserVO user_ret = new UserVO(user);
//                user_ret.setPropertyProfitRate(user.getTotalProfit()/user.getInitMoney());
//                user_ret.setHoldProfitRate(user.getHoldProfit()/user.getHoldCost());
//                List<Object> result = new ArrayList<>();
//                result.add(user_ret);
//                result.add(hold_ret);
//                return new Result(200,result,"买入操作更新成功");
            }
            else {
                // 卖出出操作更新
                // 卖出操作更新数据定义
                double sellShare = record.getCount(); // 用户卖出份额
                double netWorth = Double.parseDouble(data.getString("netWorth"));
                double sellMoney = sellShare * netWorth; // 卖出金额
                // 计算持仓成本价
                double cost = user.getHoldCost() / hold.getShare();
                double sellCost = sellShare*cost; // 卖出成本
                double sellFee = sellCost * 0.1/100;//暂定卖出手续费为0.1%
                double net_sellMoney = sellMoney - sellFee; // 净卖出金额
                double sellProfit = sellMoney - sellCost;
                //double net_sellProfit = sellProfit - sellFee; //净卖出收益
                // 更新hold表
                // HoldVO hold_ret = new HoldVO();
                hold.setShare(hold.getShare()-sellShare);
                hold.setHoldCost(hold.getHoldCost()-sellCost);
                // 更新基金累计收益
                Double total = Double.parseDouble(Objects.requireNonNull(redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getFundCode())));
                total -= sellFee;
                redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), String.valueOf(total));
                holdService.updateHold(hold);
                // 更新user表
                user.setHoldProfit(user.getHoldProfit() - sellProfit);
                user.setBuyMoney(user.getBuyMoney() - net_sellMoney);
                user.setHoldCost(user.getHoldCost()- sellCost);
                user.setMoney(user.getMoney() + net_sellMoney);
                userService.updateUser(user);
           }
            // 将record的flag设置为true代表已经处理, 更新record
            record.setFlag(true);
            operationService.insertDeal(record);
        }

        // 更新用户的总持有金额，在update中更新而不是在calculate中更新
        List<User> users = userService.getAllUsers();
        for (User user1 : users) {
            String email = user1.getEmail();
            User user = userService.findUserByEmail(email); //待返回user
            List<Fund> funds = fundService.getHoldFund(email);
            Ret_HavingList ret = new Ret_HavingList(user, funds);
            double totalHold = 0;               // 总持有金额
            for (Fund fund : ret.funds) {
                String code = fund.getCode();
                String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
                JSONObject jsonObject = JSON.parseObject(s);
                JSONObject data =(JSONObject) jsonObject.get("data");

                // 先更新基金的单位净值：这个之后不会使用，我们是直接通过比例和持有金额计算之后的持有金额
                double netWorth = Double.parseDouble(data.getString("netWorth"));   // 基金的单位净值
                fund.setNetWorth(netWorth);
                totalHold += fund.getShare() * netWorth; //累加用户总持有金额
            }
            System.out.println(totalHold);
            ret.user.setBuyMoney(totalHold);
            userService.updateUserBHT(ret.user.getEmail(), ret.user.getBuyMoney(), ret.user.getHoldProfit(), ret.user.getTotalProfit(), ret.user.getDayProfit());
        }

        return new Result(200, "", "update");
    }

    @GetMapping("update_test")
    public Result update_test() {
        List<Record> records = operationService.getAllUndoRecord();
        RestTemplate restTemplate = new RestTemplate();
        for (Record record : records) {
            if (record.isFlag()) {
                continue; // 该条交易记录已处理
            }
            User user = userService.findUserByEmail(record.getUserEmail());
            Fund fund = fundService.searchFundByCode(Integer.parseInt(record.getFundCode()));
            Hold hold = holdService.getHoldByUserEmailAndFundCode(user.getEmail(),fund.getCode());

            if (!record.isFlagTime()){
                // 代表这个交易记录今日不处理,设置为true后跳过
                record.setFlagTime(true);
                operationService.insertDeal(record);
                continue;
            }
            String code = fund.getCode();
            String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
            JSONObject jsonObject = JSON.parseObject(s);
            JSONObject data =(JSONObject) jsonObject.get("data");
            if (!record.isType()){
                // 买入操作更新数据定义
                double buyMoney = record.getCount(); // 用户买入金额
                double buyIn_fee = buyMoney * fund.getBuyRate() / 100; // 以当前买入费率为准,买入手续费
                double net_buyMoney = buyMoney - buyIn_fee; // 净买入金额
                // 获取当日净值
                double netWorth = Double.parseDouble(data.getString("netWorth"));
                // 买入份额计算
                double buyIn_share = net_buyMoney/netWorth;
                // 更新hold表          TODO 更新的信息是否完整
                //HoldVO hold_ret = new HoldVO();
                System.out.println(hold.getShare()+buyIn_share);
                hold.setShare(hold.getShare()+buyIn_share);

                System.out.println(hold.getHoldCost());
                System.out.println("net buyMoney:" + net_buyMoney);
                hold.setHoldCost(hold.getHoldCost()+net_buyMoney);
                hold.setHold(hold.getShare() * netWorth);
                // 更新基金累计收益
                Double total = Double.parseDouble(Objects.requireNonNull(redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getCode())));
                total -= buyIn_fee;
                redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), String.valueOf(total));  // TODO 什么意思
                holdService.updateHold(hold);
//                // 设置hold返回数据
//                hold_ret.setUserEmail(user.getEmail());
//                hold_ret.setFundCode(fund.getCode());
//                hold_ret.setHold(hold.getHold());
//                hold_ret.setShare(hold.getShare()+buyIn_share);
//                hold_ret.setHoldCost(hold.getHoldCost());
//                hold_ret.setHold(hold.getShare() * netWorth);
//                hold_ret.setHoldProfit(hold.getHold() - hold.getHoldCost());
//                hold_ret.setYesProfit(hold.getYesProfit());
//                hold_ret.setHoldProfitRate(hold_ret.getHoldProfit()/hold_ret.getHoldCost());
//                hold_ret.setTotalProfit(redisTemplate.opsForList().range(user.getEmail()+""+fund.getCode(), 0, -1));
                // 更新user表
                user.setBuyMoney(user.getBuyMoney()+net_buyMoney);
                user.setHoldCost(user.getHoldCost()+net_buyMoney);
                user.setTotalProfit(user.getTotalProfit() - buyIn_fee);
                userService.updateUser(user);           // TODO 这里是不是会不断的重复更新，应该可以在所有的信息都处理完毕之后一次性对用户的信息进行更新

                // 设置user返回数据
//                UserVO user_ret = new UserVO(user);
//                user_ret.setPropertyProfitRate(user.getTotalProfit()/user.getInitMoney());
//                user_ret.setHoldProfitRate(user.getHoldProfit()/user.getHoldCost());
//                List<Object> result = new ArrayList<>();
//                result.add(user_ret);
//                result.add(hold_ret);
//                return new Result(200,result,"买入操作更新成功");
            }
            else {
                // 卖出出操作更新
                // 卖出操作更新数据定义
                double sellShare = record.getCount(); // 用户卖出份额
                double netWorth = Double.parseDouble(data.getString("netWorth"));
                double sellMoney = sellShare * netWorth; // 卖出金额
                // 计算持仓成本价
                double cost = user.getHoldCost() / hold.getShare();
                double sellCost = sellShare*cost; // 卖出成本
                double sellFee = sellCost * 0.1/100;//暂定卖出手续费为0.1%
                double net_sellMoney = sellMoney - sellFee; // 净卖出金额
                double sellProfit = sellMoney - sellCost;
                //double net_sellProfit = sellProfit - sellFee; //净卖出收益
                // 更新hold表
                // HoldVO hold_ret = new HoldVO();
                hold.setShare(hold.getShare()-sellShare);
                hold.setHoldCost(hold.getHoldCost()-sellCost);
                // 更新基金累计收益
                Double total = Double.parseDouble(Objects.requireNonNull(redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getFundCode())));
                total -= sellFee;
                redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), String.valueOf(total));
                holdService.updateHold(hold);
                // 更新user表
                user.setHoldProfit(user.getHoldProfit() - sellProfit);
                user.setBuyMoney(user.getBuyMoney() - net_sellMoney);
                user.setHoldCost(user.getHoldCost()- sellCost);
                user.setMoney(user.getMoney() + net_sellMoney);
                userService.updateUser(user);
            }
            // 将record的flag设置为true代表已经处理, 更新record
            record.setFlag(true);
            operationService.insertDeal(record);
        }

        // 更新用户的总持有金额，在update中更新而不是在calculate中更新
        List<User> users = userService.getAllUsers();
        for (User user1 : users) {
            String email = user1.getEmail();
            User user = userService.findUserByEmail(email); //待返回user
            List<Fund> funds = fundService.getHoldFund(email);
            Ret_HavingList ret = new Ret_HavingList(user, funds);
            double totalHold = 0;               // 总持有金额
            for (Fund fund : ret.funds) {
                String code = fund.getCode();
                String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
                JSONObject jsonObject = JSON.parseObject(s);
                JSONObject data =(JSONObject) jsonObject.get("data");

                // 先更新基金的单位净值：这个之后不会使用，我们是直接通过比例和持有金额计算之后的持有金额
                double netWorth = Double.parseDouble(data.getString("netWorth"));   // 基金的单位净值
                fund.setNetWorth(netWorth);
                totalHold += fund.getShare() * netWorth; //累加用户总持有金额
            }
            System.out.println(totalHold);
            ret.user.setBuyMoney(totalHold);
            userService.updateUserBHT(ret.user.getEmail(), ret.user.getBuyMoney(), ret.user.getHoldProfit(), ret.user.getTotalProfit(), ret.user.getDayProfit());
        }

        return new Result(200, "", "update");
    }

    public static String addDateMinut(){
        Date date = new Date();//获得系统时间.
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("front:" + sdf.format(date)); //显示输入的日期
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        date = cal.getTime();
        System.out.println("after:" + sdf.format(date));  //显示更新后的日期
        return sdf.format(date);
    }

//    public static void main(String[] args) throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX ");
//        System.out.println(sdf.parse("2021-05-10T13:01:33.000+00:00"));
//    }




//    public static void main(String[] args) {
//        // 获取当日净值
//        RestTemplate restTemplate = new RestTemplate();
//        String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + "000001", String.class);
//        JSONObject jsonObject = JSON.parseObject(s);
//        JSONObject data =(JSONObject) jsonObject.get("data");
//        double netWorth = Double.parseDouble(data.getString("netWorth"));   // 基金的单位净值
//        System.out.println(netWorth);
//    }
}
