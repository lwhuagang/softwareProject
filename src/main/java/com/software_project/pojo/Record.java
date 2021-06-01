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
    private String fundName;
    private boolean type;//false 代表 买入,true 代表 卖出
    private Date time;
    private boolean flag; //true 该交易已处理,false 未处理
    private double count;   // 交易量：买入的时候是金额，卖出的时候是份额
    private boolean flagTime; //true 当天交易,false 明天交易
}
