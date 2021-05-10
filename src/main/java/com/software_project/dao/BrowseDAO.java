package com.software_project.dao;

import com.software_project.pojo.Browse;
import com.software_project.pojo.Search;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface BrowseDAO {

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
