package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Message {
    private int id;
    private String userEmail;

    // 清仓和补仓的消息
    private String fundCode;
    private String fundName;
    private boolean addWarehouse;
    private Date netWorthDate;
    private double netWorth;
    private Date expectWorthDate;
    private double expectWorth;
    private Date time;

    // 反馈消息
    private String message; // 用户反馈信息
    private String result;  // 管理员处理结果

    private int messageType;    // 是否是基金推送消息， 0表示基金推送消息，1表示反馈消息
    private boolean read;   // 是否已经被推送
}
