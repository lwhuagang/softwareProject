package com.software_project.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.Fund;
import com.software_project.pojo.User;
import com.software_project.service.AttentionService;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import com.software_project.vo.Ret_HavingList;
import com.software_project.vo.Ret_WatchList;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;
import java.util.List;

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
                return new Result(200,user_ret,"注册成功");
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
        boolean flag = userService.login(user.getEmail(),md5_password);
        if (flag) {
            // 说明登陆成功,此时向session中设置属性
            session.setAttribute("user",user.getEmail());
            return new Result(200,true,"登陆成功");
        }
        else {
            // 登录失败
            return new Result(200,false,"登陆失败");
        }
    }

    /**
     * 根据用户邮箱计算该用户持有的所有基金收益信息，并更新到数据库中
     * 注：这个接口一天只能调一次，因为一天只能计算一次
     * 同时获取该用户持有金额,持有收益,累计收益(直接返回user也可)
     * @param email 传入的用户email
     * @return 封装为result返回
     */
    @GetMapping("/calculate")
    public Result calculate(String email) {
        User user = userService.findUserByEmail(email); //待返回user
        List<Fund> funds = fundService.getHoldFund(email);
        Ret_HavingList ret = new Ret_HavingList(user, funds);
        double totalProfit = 0;
        double totalHold = 0;

        RestTemplate restTemplate = new RestTemplate();
        for (Fund fund : ret.funds) {
            // 计算每支基金的昨日收益和昨日收益率, 并更新该用户该基金持有收益和持有收益率
            String code = fund.getCode();
            String s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund/detail?token=atTPd9c8sA&code=" + code + "&startDate=2021-04-01", String.class);
            JSONObject jsonObject = JSON.parseObject(s);
            JSONObject data =(JSONObject) jsonObject.get("data");
            double growth = Double.parseDouble(data.getString("dayGrowth"));
            // 计算昨日收益和昨日收益率
            fund.setYesRate(growth); // 单位百分比
            fund.setYesProfit(growth/100.0 * fund.getHold());
            totalProfit += fund.getYesProfit(); //累加昨日总收益
            // 更新该基金持有收益和持有收益率
            fund.setHoldProfit(fund.getHoldProfit() + fund.getYesProfit()); // 持有收益
            fund.setHold(fund.getHold() + fund.getYesProfit()); // 总持有金额
            fund.setRate(fund.getHoldProfit() / fund.getHold() * 100); //持有收益率 单位百分比
            totalHold += fund.getHold(); //累加用户总持有金额
    }
        // 更新user类中的持有收益和总收益(昨日收益总和)
        ret.user.setHoldProfit(user.getHoldProfit() + totalProfit);
        ret.user.setTotalProfit(user.getTotalProfit() + totalProfit);
        ret.user.setBuyMoney(totalHold);

        // 将修改的数据写回数据库
        // 更新user buyMoney,holdProfit,TotalProfit     us er表中的数据
        userService.updateUserBHT(ret.user.getEmail(), ret.user.getBuyMoney(), ret.user.getHoldProfit(), ret.user.getTotalProfit());
        String userEmail = ret.user.getEmail();
        // 更新hold holdProfit          hold表中数据,是对所有的持有基金进行更新
        for (Fund fund: ret.funds) {
            holdService.updateHoldHH(userEmail, fund.getFundCode(), fund.getHold(), fund.getHoldProfit());
        }
        return new Result(200,ret,"根据用户邮箱计算该用户当日的基金收益信息");
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
        Ret_HavingList ret = new Ret_HavingList(user, funds);
        return new Result(200, ret, "根据用户邮箱获取用户和该用户持有的所有基金");
    }

    @GetMapping("watchList")
    public Result watchList(String email) {
        User user = userService.findUserByEmail(email);
        List<Fund> funds = attentionService.getWatchList(email);
        // 这里返回的funds应该是从外部接口里面调用获取的基金详细信息
        // 用fund的code查询基金的详细信息
        StringBuilder fundCodes = new StringBuilder();
        for (Fund fund : funds) {
            fundCodes.append(fund.getCode());
            fundCodes.append(",");
        }
        fundCodes.deleteCharAt(fundCodes.length()-1);
        System.out.println(fundCodes);
        String s;
        RestTemplate restTemplate = new RestTemplate();
        s = restTemplate.getForObject("https://api.doctorxiong.club/v1/fund?token=atTPd9c8sA&code=" + fundCodes, String.class);
        Object parse = JSONObject.parse(s);
        Ret_WatchList ret = new Ret_WatchList(user, parse);
        return new Result(200, ret, "根据用户邮箱获取用户和该用户关注的所有基金");
    }



    /**
     * 测试拦截器功能是否正常
     */
    @GetMapping("test")
    public Result test(){
        return new Result(200,"成功进入","你赢了");
    }
}
