package com.software_project.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class updateUserByAdmin {
    private String email;
    private boolean admin;
}
