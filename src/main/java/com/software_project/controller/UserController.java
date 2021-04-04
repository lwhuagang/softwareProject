package com.software_project.controller;

import com.software_project.pojo.User;
import com.software_project.service.UserService;
import com.software_project.utils.MD5Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;

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
     * @param email 用户邮箱属性
     * @param password 用户密码
     * @param nickname 用户昵称
     * @param captcha 用户验证码
     * @return 返回用户对象toString()
     */
    @ResponseBody
    @PostMapping("register")
    public String register(String email,String password,String nickname,int money,String captcha) {
        // 先判断该用户是否已经注册过
        User user_find = userService.findUserByEmail(email);
        if (user_find == null){
            // 说明没有被注册过,可以进行注册
            // 注册密码进行md5加密
            String md5_password = MD5Utils.code(password);
            User user = new User(email,md5_password,nickname,money,"");
            User ret_user = userService.register(user, captcha);
            if (ret_user != null){
                // 说明用户注册成功
                return ret_user.toString();
            }
            else {
                // 说明用户注册失败
                return null;
            }
        }
        else {
            // 说明被注册过
            return null;
        }
    }

    /**
     * 输入登录账号和密码,尝试进行登录
     * @param email 登录邮箱
     * @param password 登录密码
     * @return 是否登录成功的flag
     */
    @ResponseBody
    @PostMapping("login")
    public boolean login(String email, String password, HttpSession session){
        // 登录密码进行md5加密,将加密后的密码传入进行比对
        String md5_password = MD5Utils.code(password);
        // flag为true说明该账号登录成功,否则说明登录失败
        boolean flag = userService.login(email,md5_password);
        if (flag) {
            // 说明登陆成功,此时向session中设置属性
            session.setAttribute("user",email);
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
