package com.software_project.service;

import com.software_project.dao.UserDAO;
import com.software_project.pojo.User;
import com.software_project.utils.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class UserServiceImpl implements UserService{
    // 验证码生成范围
    private final char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','K', 'M', 'N', 'P','R','S','T','W','X', 'Y','3', '4', '5', '6', '7', '8', '9'};
    // 邮箱发送类
    private final Email emailUtil = new Email();
    // redis操作类,用来存储用户对应验证码,并设置过期时间
    @Autowired
    private StringRedisTemplate redisTemplate;
    // dao
    @Autowired
    private UserDAO userDAO;

    @Override
    public void sendCaptcha(String email) throws MessagingException {
        // 生成随机验证码
        StringBuilder captcha= new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            String rand = String.valueOf(codeSequence[random.nextInt(codeSequence.length)]);
            captcha.append(rand);
        }
        // 利用工具类向目标邮箱发送验证码
        emailUtil.sendEmail(email,captcha.toString());
        // 将该验证码存储到redis中,并设置过期时间,默认为5分钟
        redisTemplate.opsForValue().set(email,captcha.toString(),300, TimeUnit.SECONDS);
    }

    @Override
    public User register(User user, String captcha) {
        // 先对输入验证码的正确性进行验证
        String saved_captcha = redisTemplate.opsForValue().get(user.getEmail());
        if(saved_captcha != null && saved_captcha.equals(captcha)){
            // 说明验证码未过期且输入正确!
            // 进行用户注册
            userDAO.insertUser(user);
            return user;
        }
        else {
            // 验证码输入错误或者验证码为空
            return null;
        }
    }

    @Override
    public boolean login(String email, String password) {
        User user = userDAO.findUserByEmail(email);
        // 返回true说明该账号登录成功,否则说明登录失败
        return user.getPassword().equals(password);
    }

    @Override
    public User findUserByEmail(String email){
        return userDAO.findUserByEmail(email);
    }

    @Override
    public void updateUserBHT(String email, double buyMoney, double holdProfit, double totalProfit, double dayProfit) {
        userDAO.updateUserBHT(email, buyMoney, holdProfit, totalProfit, dayProfit);
    }

    @Override
    public void updateUser(User user) {
        userDAO.updateUser(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
    }

    @Override
    public void deleteUser(String email) {
        userDAO.deleteUser(email);
    }

}
