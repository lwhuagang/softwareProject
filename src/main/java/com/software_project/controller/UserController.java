package com.software_project.controller;

import com.software_project.pojo.User;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;
import java.util.Map;

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
    public String sendCaptcha(String email) throws MessagingException {
        userService.sendCaptcha(email);
        return "验证码发送成功";
    }

    /**
     * 进行账号注册
     * @param params 用户注册账号,密码,昵称,起始金额+用户验证码
     * @return 返回用户对象toString()
     */
    @ResponseBody
    @PostMapping("register")
    public User register(@RequestBody Param params) {
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
            return userService.register(user, captcha);
        }
        else {
            // 说明被注册过
            return null;
        }
    }

    /**
     * register的参数包装类
     */
    static class Param{
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
    public boolean login(@RequestBody User user, HttpSession session){
        // 登录密码进行md5加密,将加密后的密码传入进行比对
        String md5_password = MD5Utils.code(user.getPassword());
        // flag为true说明该账号登录成功,否则说明登录失败
        boolean flag = userService.login(user.getEmail(),md5_password);
        if (flag) {
            // 说明登陆成功,此时向session中设置属性
            session.setAttribute("user",user.getEmail());
            return true;
        }
        else {
            // 登录失败
            return false;
        }
    }

    /**
     * 测试拦截器功能是否正常
     */
    @ResponseBody
    @GetMapping("test")
    public String test(){
        return "成功进入";
    }
}
