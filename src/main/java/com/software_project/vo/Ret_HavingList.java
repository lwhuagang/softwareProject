package com.software_project.vo;

import com.software_project.pojo.Fund;
import com.software_project.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * register的参 数包装类
 */
@AllArgsConstructor
@Data
public class Ret_HavingList {
    public User user;
    public List<Fund> funds;
}
