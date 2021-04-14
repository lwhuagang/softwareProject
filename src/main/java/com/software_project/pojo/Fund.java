package com.software_project.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Component
public class Fund {
    private String code;
    private String name;
    private String type;
    private double buyMin;
    private double buySourceRate;
    private double buyRate;
    private String manager;
}
