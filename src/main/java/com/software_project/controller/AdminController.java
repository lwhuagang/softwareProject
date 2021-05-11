package com.software_project.controller;

import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Fund;
import com.software_project.service.FeedBackService;
import com.software_project.service.FundService;
import com.software_project.service.UserService;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("admin")
public class AdminController {
    @Autowired
    FundService fundService;

    @Autowired
    UserService userService;

    @Autowired
    private FeedBackService feedBackService;

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

    @GetMapping("getAllFD")
    public Result findAllFeedBack() {
        List<FeedBack> feedBacks = feedBackService.findAllFeedBack();
        return new Result(200, feedBacks, "获取所有的反馈记录");
    }

    @GetMapping("getAllFDNo")
    public Result getAllFDNo() {
        List<FeedBack> feedBacks = feedBackService.getAllFDNo();
        return new Result(200, feedBacks, "获取所有未处理的反馈记录");
    }

    @GetMapping("getAllFDyes")
    public Result getAllFDyes() {
        List<FeedBack> feedBacks = feedBackService.getAllFDyes();
        return new Result(200, feedBacks, "获取所有已经处理的反馈记录");
    }

    @PostMapping("updateFD")
    public Result ProFeedBack(@RequestBody FeedBack feedBack) {
        // 处理用户的反馈

        feedBackService.updateFD(feedBack);
        return new Result(200, feedBack, "处理用户的某个反馈记录");
    }
}
