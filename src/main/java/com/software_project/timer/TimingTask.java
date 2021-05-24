package com.software_project.timer;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.software_project.controller.AdminController;
import com.software_project.controller.*;
import com.software_project.controller.OperationController;
import com.software_project.controller.UserController;
import com.software_project.pojo.Fund;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Record;
import com.software_project.pojo.User;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.OperationService;
import com.software_project.service.UserService;
import com.software_project.vo.Result;
import com.software_project.vo.Ret_HavingList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Component
public class TimingTask {
    @Autowired
    private UserService userService;

    @Autowired
    private FundService fundService;

    @Autowired
    private HoldService holdService;

    @Autowired
    StringRedisTemplate redisTemplate;

    @Autowired
    OperationService operationService;

    @Autowired
    MessageController messageController;

    @Autowired
    AdminController adminController;
    /**
     *  工作日的每天晚上九点执行一次
     */
    @Scheduled(cron="0 30 21 ? * MON-FRI")
    //@Scheduled(cron = "0/5 * * * * ?")
    public void executeFileDownLoadTask() throws ParseException {
        calculate();
        update();

        List<User> allUsers = (List<User>)adminController.getAllUsers().getObj();       // 取出所有的用户
        for (User allUser : allUsers) {     // 处理所有用户的基金推送消息
            messageController.addFundMsg2(allUser.getEmail());
        }
    }

    public Result calculate() throws ParseException {
        // 获取所有的用户
        List<User> users = userService.getAllUsers();
        for (User user1 : users) {
            String email = user1.getEmail();
            User user = userService.findUserByEmail(email); //待返回user
            List<Fund> funds = fundService.getHoldFund(email);
            Ret_HavingList ret = new Ret_HavingList(user, funds);
            double totalProfit = 0;             // 总持有收益
            // double totalHold = 0;               // 总持有金额

            RestTemplate restTemplate = new RestTemplate();
            for (Fund fund : ret.funds) {
                // 获取基金详细信息的对象
                String code = fund.getCode();
                String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
                JSONObject jsonObject = JSON.parseObject(s);
                JSONObject data =(JSONObject) jsonObject.get("data");

                String netWorthDate  = data.getString("netWorthDate");
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date date = dateFormat.parse(netWorthDate);

                Date d=new Date();

                if (date.getYear() != d.getYear() || date.getMonth() != d.getMonth() || date.getDay() != d.getDay()) {
                    // 说明非工作日净值没有更新,只需要让累计收益添加一个即可
                    String s1;
                    double total;
                    try {
                        s1 = redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getFundCode());
                        total = Double.parseDouble(s1);
                        redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), s1);
                    }
                    catch (Exception e){
                        total = 0;
                    }
                    String key = user.getEmail().substring(0,8) + ":" + fund.getFundCode();
                    if (redisTemplate.opsForList().range(key,0,-1).size() >= 30) {
                        // 只存储三十天的累计收益
                        redisTemplate.opsForList().leftPop(key);
                        redisTemplate.opsForList().rightPush(key, String.valueOf(total));
                        System.out.println(redisTemplate.opsForList().range(key,0,-1));
                    }
                    else{
                        redisTemplate.opsForList().rightPush(key, String.valueOf(total));
                        System.out.println(redisTemplate.opsForList().range(key,0,-1));
                    }
                    continue;
                }

                // 先更新基金的单位净值：这个之后不会使用，我们是直接通过比例和持有金额计算之后的持有金额
                double netWorth = Double.parseDouble(data.getString("netWorth"));   // 基金的单位净值
                fund.setNetWorth(netWorth);

                // 更新该基金的昨日收益率
                double growth = Double.parseDouble(data.getString("dayGrowth"));// 每日增长比例，返回的结果是一个double类型的小于100的数
                fund.setYesRate(growth); // 单位百分比

                // 更新基金的昨日收益， 这个在最后统一更新
                fund.setYesProfit(growth/100.0 * fund.getShare() * netWorth);

                // 计算该用户总的昨日收益
                totalProfit += fund.getYesProfit(); //累加昨日总收益

                // 更新该基金持有收益、持有金额和持有收益率
                fund.setHoldProfit(fund.getHoldProfit() + fund.getYesProfit()); // 持有收益
//            fund.setHold(fund.getShare() * netWorth + fund.getYesProfit()); // 总持有金额，算法二
                fund.setHold(fund.getShare() * netWorth); // 总持有金额，算法一
                fund.setRate(fund.getHoldProfit() / fund.getHold() * 100); //持有收益率 单位百分比

                // 计算该用户总的持有金额
                // 这里
                // totalHold += fund.getShare() * netWorth; //累加用户总持有金额



//            // 计算每支基金的昨日收益和昨日收益率, 并更新该用户该基金持有收益和持有收益率
//            double growth = Double.parseDouble(data.getString("dayGrowth"));// 每日增长比例，返回的结果是一个double类型的小于100的数
//            // 计算昨日收益和昨日收益率
//            fund.setYesRate(growth); // 单位百分比
//            fund.setYesProfit(growth/100.0 * fund.getShare() * netWorth);
//            totalProfit += fund.getYesProfit(); //累加昨日总收益
//            // 更新该基金持有收益和持有收益率
//            fund.setHoldProfit(fund.getHoldProfit() + fund.getYesProfit()); // 持有收益
//            fund.setHold(fund.getShare() * netWorth + fund.getYesProfit()); // 总持有金额
//            fund.setRate(fund.getHoldProfit() / fund.getShare() * netWorth * 100); //持有收益率 单位百分比
//            totalHold += fund.getShare() * netWorth; //累加用户总持有金额
                // 更新每支基金对应每个用户的累计收益
                // 更新基金累计收益
                String s1;
                double total;
                try {
                    s1 = redisTemplate.opsForList().rightPop(user.getEmail().substring(0,8) + ":" + fund.getFundCode());
                    total = Double.parseDouble(s1);
                    redisTemplate.opsForList().rightPush(user.getEmail().substring(0,8) + ":" + fund.getFundCode(), s1);
                    total += fund.getYesProfit();
                }
                catch (Exception e){
                    total = 0;
                }
                String key = user.getEmail().substring(0,8) + ":" + fund.getFundCode();
                if (redisTemplate.opsForList().range(key,0,-1).size() >= 30) {
                    // 只存储三十天的累计收益
                    redisTemplate.opsForList().leftPop(key);
                    redisTemplate.opsForList().rightPush(key, String.valueOf(total));
                    System.out.println(redisTemplate.opsForList().range(key,0,-1));
                }
                else{
                    redisTemplate.opsForList().rightPush(key, String.valueOf(total));
                    System.out.println(redisTemplate.opsForList().range(key,0,-1));
                }
            }
            // 更新user类中的持有收益和总收益(昨日收益总和)
            ret.user.setHoldProfit(user.getHoldProfit() + totalProfit); // 总的持有收益
            ret.user.setTotalProfit(user.getTotalProfit() + totalProfit);   // 用户的总收益

            // 在update中更新
            //ret.user.setBuyMoney(totalHold);

            ret.user.setDayProfit(totalProfit); // 该用户昨日的总收益


            // 将修改的数据写回数据库
            // 更新user buyMoney,holdProfit,TotalProfit, dayProfit     user表中的数据
            userService.updateUserBHT(ret.user.getEmail(), ret.user.getBuyMoney(), ret.user.getHoldProfit(), ret.user.getTotalProfit(), ret.user.getDayProfit());
            String userEmail = ret.user.getEmail();
            // 更新hold holdProfit          hold表中数据,是对所有的持有基金进行更新
            for (Fund fund: ret.funds) {
                holdService.updateHoldHH(userEmail, fund.getFundCode(), fund.getHold(), fund.getHoldProfit(), fund.getYesProfit());
            }
        }
        return new Result(200, "", "计算用户持有信息");
        // return new Result(200,ret,"根据用户邮箱计算该用户当日的基金收益信息");
    }

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

}