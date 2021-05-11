package com.software_project.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class updateVO {
    private String email;
    private String name;
    private double money;
    private String avatarLink;
}
