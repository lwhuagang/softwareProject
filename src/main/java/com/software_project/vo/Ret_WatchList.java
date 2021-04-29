package com.software_project.vo;

import com.software_project.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Ret_WatchList{
    public User user;
    public Object funds;
}
