package com.software_project.controller;

import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Message;
import com.software_project.service.MessageService;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("message")
@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("insertFundMsg")
    public Result insertFundMsg(@RequestBody Message message) {
        messageService.insertMessageOne(message);
        return new Result(200, message, "插入一条基金清仓/补仓的消息");
    }

//    public Result insertFundBackMsg(FeedBack feedBack) {
//        messageService.insertMessageTwo(feedBack);
//        return new Result(200, feedBack, "插入一条处理反馈的消息");
//    }

    @GetMapping("getAllNotReadMsg")
    public Result getAllNotReadMsg(String userEmail){
        List<Message> messages = messageService.getNotReadMessage(userEmail);
        return new Result(200, messages, "获取所有未读的消息");
    }

    @GetMapping("clearAllNotReadMsg")
    public Result clearAllNotReadMsg(String userEmail){
        messageService.clearNotReadMessage(userEmail);
        return new Result(200, true, "清除所有未读消息");
    }

    @GetMapping("getAllReadMessage")
    public Result getAllReadMessage(String userEmail) {
        List<Message> allReadMessage = messageService.getAllReadMessage(userEmail);
        return new Result(200, allReadMessage, "获取该用户的所有已读信息");
    }

    @GetMapping("getAllMessage")
    public Result getAllMessage(String userEmail) {
        List<Message> allReadMessage = messageService.getAllMessage(userEmail);
        return new Result(200, allReadMessage, "获取该用户的所有信息");
    }

    @GetMapping("deleteAllMessage")
    public Result deleteAllMessage(String userEmail) {
        messageService.deleteAllMessage(userEmail);
        return new Result(200, true, "删除该用户的所有信息");
    }


}
