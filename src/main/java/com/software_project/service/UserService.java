package com.software_project.service;

import com.software_project.pojo.User;
import org.apache.ibatis.annotations.Param;

import javax.mail.MessagingException;
import java.util.List;

public interface UserService {

    /**
     * 向传入邮箱发送一个验证码并将其设置好过期时间保存在redis中.
     * @param email 邮件
     */
    void sendCaptcha(String email) throws MessagingException;

    /**
     * 进行用户注册,注册完成后返回注册成功的用户实例以便相关信息展示
     * 如果用户验证码输入错误或空则直接返回空
     * @param user 传入用户进行注册
     * @return user
     */
    User register(User user, String Captcha);


    /**
     * 传入用户的账号密码进行登录
     * @param email 账号
     * @param password 密码
     * @return 记录登录是否成功
     */
    boolean login(String email, String password);

    /**
     * 根据email找到user
     * @param email 账号
     * @return 找寻user
     */
    User findUserByEmail(String email);

    /**
     * 该方法用于更新用户表中的一下几个属性
     * @param email 用户id
     * @param buyMoney  用户用于基金的金额
     * @param holdProfit   用户的总持有收益
     * @param totalProfit  用户的累计收益
     * @param dayProfit    用户的昨日收益
     */
    void updateUserBHT(String email, double buyMoney, double holdProfit, double totalProfit, double dayProfit);


    /**
     * @param user 待更新用户
     */
    void updateUser(User user);

    /**
     * 获取所有用户信息
     * @return 返回所有用户信息
     */
    List<User> getAllUsers();

    /**
     * 删除用户
     * @param email 用户邮箱
     */
    void deleteUser(String email);

    /**
     * 添加用户的金额
     * @param email 用户邮箱
     * @param money 待添加的金额
     */
    void updateUserMoney(@Param("email") String email, @Param("money") double money);
}
