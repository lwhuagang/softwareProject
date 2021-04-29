package com.software_project.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * code response状态码
 * obj 返回给前端的数据
 * message 附加信息,说明具体情况
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    public int code;
    public Object obj;
    public String message;
}
