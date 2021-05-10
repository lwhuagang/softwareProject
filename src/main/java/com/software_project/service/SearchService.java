package com.software_project.service;

import com.software_project.pojo.Search;

import java.util.List;

public interface SearchService {
    /**
     * 插入一个搜索记录
     * @param search 待插入的搜索记录
     */
    void insertSearch(Search search);

    /**
     * 查找用户的所有搜索历史
     * @param userEmail 用户邮箱
     * @return  搜索记录
     */
    List<Search> findSearchByEmail(String userEmail);
}
