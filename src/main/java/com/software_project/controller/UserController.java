package com.software_project.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.software_project.pojo.User;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;

@Controller
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 发送验证码
     * @param email 要发送到的邮箱
     * @return 返回一个状态码/字符串
     * @throws MessagingException 邮件发送异常
     */
    @ResponseBody
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
    @ResponseBody
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
            user.setPic_url("");
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
     * register的参数包装类
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
    @ResponseBody
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
     * 按筛选条件进行基金列表返回,使用restTemplate进行第三方url接口调用
     * @param params 传入参数 基金类型 时长
     * @return 返回调用第三方接口获取的基金筛选列表
     */
    @ResponseBody
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
        System.out.println(formEntity.getHeaders());
        System.out.println(formEntity.getBody());

        String s = restTemplate.postForObject("https://api.doctorxiong.club/v1/fund/rank", formEntity, String.class);
        Object parse = JSONObject.parse(s);
        return new Result(200,parse,"返回根据输入条件搜索的结果");
    }

    /**
     * 筛选条件的参数包装类
     */
    static class Param_queryByParams{
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
     * 测试拦截器功能是否正常
     */
    @ResponseBody
    @GetMapping("test")
    public Result test(){
        return new Result(200,"成功进入","你赢了");
    }
}
