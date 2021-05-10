package com.software_project.service;

import com.software_project.pojo.Browse;

import java.util.List;

public interface BrowseService {
    /**
     * 插入一个浏览记录
     * @param browse 待插入的浏览记录
     */
    void insertBrowse(Browse browse);

    /**
     * 查询用户的浏览记录
     * @param userEmail 用户邮箱
     * @return 该用户的所有的浏览记录
     */
    List<Browse> findBrowseByEmail(String userEmail);
}
