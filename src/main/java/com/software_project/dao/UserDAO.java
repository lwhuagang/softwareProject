package com.software_project.dao;

import com.software_project.pojo.User;
import org.apache.ibatis.annotations.Mapper;
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
}
