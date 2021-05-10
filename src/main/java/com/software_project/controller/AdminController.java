package com.software_project.controller;

import com.software_project.pojo.FeedBack;
import com.software_project.service.FeedBackService;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("admin")
public class AdminController {
    @Autowired
    private FeedBackService feedBackService;

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
