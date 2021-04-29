package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@Data
@Component
@AllArgsConstructor
@NoArgsConstructor
public class Record {
    // record表属性
    private String userEmail;
    private String fundCode;
    private boolean type;//false 代表 买入,true 代表 卖出
    private Date time;
    private boolean flag; //true 该交易已处理,false 未处理
    private double count;
    private boolean flagTime; //true 该时间已经加了12小时,false 未加12小时
}
