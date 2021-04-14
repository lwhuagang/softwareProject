package com.software_project.controller;

import com.software_project.pojo.Fund;
import com.software_project.pojo.User;
import com.software_project.service.FundService;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
     * 根据用户邮箱查询到该用户持有的所有基金
     * 同时获取该用户持有金额,持有收益,累计收益(直接返回user也可)
     * @param email 传入的用户email
     * @return 封装为result返回
     */
    @GetMapping("/havingList")
    public Result havingList(String email) {
        User user = userService.findUserByEmail(email); //待返回user
        List<Fund> funds = fundService.getHoldFund(email);
        Ret_HavingList ret = new Ret_HavingList(user, funds);
        return new Result(200,ret,"根据用户邮箱获取用户和该用户持有的所有基金");
    }

    /**
     * register的参 数包装类
     */
    @AllArgsConstructor
    @Data
    static class Ret_HavingList{
        public User user;
        public List<Fund> funds;
    }

    /**
     * 测试拦截器功能是否正常
     */
    @GetMapping("test")
    public Result test(){
        return new Result(200,"成功进入","你赢了");
    }
}
