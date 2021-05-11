package com.software_project.controller;

import com.software_project.pojo.Fund;
import com.software_project.service.FundService;
import com.software_project.service.UserService;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin")
public class AdminController {
    @Autowired
    FundService fundService;

    @Autowired
    UserService userService;

    @GetMapping("fundOff")
    public Result FundOff(int fundCode){
        fundService.deleteFund(fundCode);
        return new Result(200,true,"下架成功");
    }

    @PostMapping("fundOn")
    public Result FundOn(@RequestBody Fund fund){
        fundService.insertFund(fund);
        return new Result(200,true,"上架成功");
    }

    @GetMapping("userDelete")
    public Result UserDelete(String email){
        userService.deleteUser(email);
        return new Result(200,true,"用户删除成功");
    }
}
