package com.software_project.dao;

import com.software_project.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UserDAO {

    /**
     * 根据邮箱获取用户对象
     * @param email 邮箱
     * @return User
     */
    User findUserByEmail(String email);


    /**
     * 向数据库表中插入用户对象
     * @param user 用户对象
     */
    void insertUser(User user);

    /**
     * 该方法用于更新用户表中的一下几个属性
     * @param email 用户id
     * @param buyMoney  用户用于基金的金额
     * @param holdProfit   用户的总持有收益
     * @param totalProfit  用户的累计收益
     */
    void updateUserBHT(@Param("email") String email, @Param("buyMoney") double buyMoney, @Param("holdProfit") double holdProfit, @Param("totalProfit") double totalProfit, @Param("dayProfit") double dayProfit);


    /**
     * 更新用户
     * @param user user对象
     */
    void updateUser(User user);
}
