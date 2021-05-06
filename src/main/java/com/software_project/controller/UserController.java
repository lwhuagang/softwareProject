package com.software_project.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.api.R;
import com.software_project.pojo.Fund;
import com.software_project.pojo.Hold;
import com.software_project.pojo.Record;
import com.software_project.pojo.User;
import com.software_project.service.AttentionService;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.RecordService;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import com.software_project.vo.HoldVO;
import com.software_project.vo.Result;
import com.software_project.vo.Ret_HavingList;
import com.software_project.vo.Ret_HoldVOList;
import com.software_project.vo.Ret_WatchList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FundService fundService;

    @Autowired
    private HoldService holdService;

    @Autowired
    private AttentionService attentionService;

    @Autowired
    StringRedisTemplate redisTemplate;

    @Autowired
    private RecordService recordService;

    /**
     * 发送验证码
     * @param email 要发送到的邮箱
     * @return 返回一个状态码/字符串
     * @throws MessagingException 邮件发送异常
     */
    @GetMapping("captcha")
    public Result sendCaptcha(String email) throws MessagingException {
        userService.sendCaptcha(email);
        return new Result(200,true,"验证码发送成功");
    }

    /**
     * 进行账号注册
     * @param params 用户注册账号,密码,昵称,起始金额+用户验证码
     * @return 返回用户对象toString()
     */
    @PostMapping("register")
    public Result register(@RequestBody Param_register params) {
        // 从params中获取对应属性
        User user = params.user;
        String captcha = params.captcha;
        // 先判断该用户是否已经注册过
        User user_find = userService.findUserByEmail(user.getEmail());
        if (user_find == null){
            // 说明没有被注册过,可以进行注册
            // 注册密码进行md5加密
            user.setPicUrl("");
            String md5_password = MD5Utils.code(user.getPassword());
            user.setPassword(md5_password);
            // 有对象说明用户注册成功
            // null说明用户注册失败
            User user_ret = userService.register(user, captcha);
            if (user_ret == null){
                return new Result(200,null,"注册失败,验证码输入错误");
            }
            else {
                return new Result(200, user_ret,"注册成功");
            }
        }
        else {
            // 说明被注册过
            return new Result(200,null,"注册失败,该账户已被注册");
        }
    }


    /**
     * register的参 数包装类
     */
    static class Param_register{
        public User user;
        public String captcha;
    }

    /**
     * 输入登录账号和密码,尝试进行登录
     * @param user 主要包含用户邮箱和密码信息
     * @return 是否登录成功的flag
     */
    @PostMapping("login")
    public Result login(@RequestBody User user, HttpSession session){
        // 登录密码进行md5加密,将加密后的密码传入进行比对
        String md5_password = MD5Utils.code(user.getPassword());
        // flag为true说明该账号登录成功,否则说明登录失败
        boolean flag = userService.login(user.getEmail(), md5_password);
        if (flag) {
            User user1 = userService.findUserByEmail(user.getEmail());
            // 说明登陆成功,此时向session中设置属性
            session.setAttribute("user",user.getEmail());
            return new Result(200, user1,"登陆成功");
        }
        else {
            // 登录失败
            return new Result(200,null,"登陆失败");
        }
    }

    @GetMapping("message")
    public  Result getUser(String email) {
        User user = userService.findUserByEmail(email);
        return new Result(200, user, "获取用户信息");
    }

    @GetMapping("/updateDatBase")
    public Result updateAllFundsFromOutside() {
        RestTemplate restTemplate = new RestTemplate();
        String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/all?token=atTPd9c8sA", String.class);
        JSONObject jsonObject = JSON.parseObject(s);
        List funds = jsonObject.getJSONArray("data");
        for (Object fund : funds) {
            String code;
            String name;
            String type;
            double buyMin;  // buyMin 起购额度
            double buySourceRate;   // 原始的买入费率
            double buyRate;         // 当前的买入费率
            String manager;         // 基金经理
            double netWorth;        // 基金净值
            code = (String)((List) fund).get(0);
            name = (String)((List) fund).get(2);
            type = (String)((List) fund).get(3);
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + ((List) fund).get(0), String.class);
            jsonObject = JSON.parseObject(s);
            JSONObject data =(JSONObject) jsonObject.get("data");
            if (data != null) {
                if (data.getString("buyMin") != null && !data.getString("buyMin").equals("")) {
                    buyMin = Double.parseDouble(data.getString("buyMin"));
                }
                else {
                    buyMin = 0;
                }
                if (data.getString("buySourceRate") != null && !data.getString("buySourceRate").equals("")) {
                    buySourceRate = Double.parseDouble(data.getString("buySourceRate"));
                }
                else {
                    buySourceRate = 0;
                }
                if (data.getString("buyRate") != null && !data.getString("buyRate").equals("")) {
                    buyRate = Double.parseDouble(data.getString("buyRate"));
                }
                else {
                    buyRate = 0;
                }
                if (data.getString("manager") != null) {
                    manager = data.getString("manager");
                }
                else {
                    manager = "";
                }

                if (data.getString("netWorth") != null) {
                    netWorth = Double.parseDouble(data.getString("netWorth"));
                }
                else {
                    netWorth = 0;
                }
            }
            else {
                buyMin = 0;
                buySourceRate = 0;
                buyRate = 0;
                manager = "";
                netWorth = 0;
            }

            Fund fund1 = new Fund();
            fund1.setCode(code);
            fund1.setName(name);
            fund1.setType(type);
            fund1.setBuyMin(buyMin);
            fund1.setBuySourceRate(buySourceRate);
            fund1.setBuyRate(buyRate);
            fund1.setManager(manager);
            fund1.setNetWorth(netWorth);
            if (fundService.searchFundByCode(Integer.parseInt(code)) == null) {
                fundService.insertFund(fund1);
            }
        }
        return new Result(200, s,"更新数据库中的基金");
    }

    /**
     * 根据用户邮箱计算该用户持有的所有基金收益信息，并更新到数据库中
     * 注：这个接口一天只能调一次，因为一天只能计算一次
     * 同时获取该用户持有金额,持有收益,累计收益(直接返回user也可)
     * @return 封装为result返回
     */
    @GetMapping("/calculate")
    public Result calculate() {
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
                    redisTemplate.opsForList().rightPush(key, String.valueOf(0));
                    System.out.println(redisTemplate.opsForList().range(key,0,-1));
                }
                else{
                    redisTemplate.opsForList().rightPush(key, String.valueOf(total));
                    redisTemplate.opsForList().rightPush(key, String.valueOf(0));
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

    /**
     * 根据用户邮箱查询到该用户持有的所有基金
     * @param email         用户id
     * @return              封装为result返回
     */
    @GetMapping("/havingList")
    public Result havingList(String email) {
        User user = userService.findUserByEmail(email); //待返回user
        List<Fund> funds = fundService.getHoldFund(email);
        List<HoldVO> holdVOS = new ArrayList<>();
        for (Fund fund : funds) {
            Hold hold = holdService.getHoldByUserEmailAndFundCode(email, fund.getFundCode());
            HoldVO holdVO = new HoldVO(email, fund, hold);
            holdVO.setTotalProfit(redisTemplate.opsForList().range(user.getEmail().substring(0,8)+":"+fund.getFundCode(), 0, -1));
            holdVO.setToVerifyMoney(getVerifyMoney(user.getEmail(), fund.getFundCode()));     // 设置待确认金额
            // holdVO.setShare(fund.getShare() * netWorth);

            // 计算
            //holdVOS.s
            holdVOS.add(holdVO);
        }
        Ret_HoldVOList ret = new Ret_HoldVOList(user, holdVOS);
        return new Result(200, ret, "根据用户邮箱获取用户和该用户持有的所有基金及其持有信息");
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

    @GetMapping("watchList")
    public Result watchList(String email) {
        User user = userService.findUserByEmail(email);
        List<Fund> funds = attentionService.getWatchList(email);
        // 这里返回的funds应该是从外部接口里面调用获取的基金详细信息
        // 用fund的code查询基金的详细信息
        StringBuilder fundCodes = new StringBuilder();
        Object parse;
        if (funds.size() != 0) {
            for (Fund fund : funds) {
                fundCodes.append(fund.getCode());
                fundCodes.append(",");
            }
            fundCodes.deleteCharAt(fundCodes.length()-1);
            System.out.println(fundCodes);
            String s;
            RestTemplate restTemplate = new RestTemplate();
            s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund?token=atTPd9c8sA&code=" + fundCodes, String.class);
            parse = JSONObject.parse(s);
        }
        else {
            parse = "";    // 如果关注列表为空，直接返回一个空的字符串
        }

        Ret_WatchList ret = new Ret_WatchList(user, parse);
        return new Result(200, ret, "根据用户邮箱获取用户和该用户关注的所有基金");
    }


    @PostMapping("")


    /**
     * 测试拦截器功能是否正常
     */
    @GetMapping("test")
    public Result test(){
        return new Result(200,"成功进入","你赢了");
    }
}
