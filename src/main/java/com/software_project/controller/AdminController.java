package com.software_project.controller;

import com.software_project.pojo.FeedBack;
import com.software_project.pojo.Fund;
import com.software_project.pojo.User;
import com.software_project.service.AttentionService;
import com.software_project.service.BrowseService;
import com.software_project.service.FeedBackService;
import com.software_project.service.FundService;
import com.software_project.service.HoldService;
import com.software_project.service.MessageService;
import com.software_project.service.OperationService;
import com.software_project.service.RecordService;
import com.software_project.service.SearchService;
import com.software_project.service.UserService;
import com.software_project.vo.Result;
import com.software_project.vo.updateUserByAdmin;
import com.software_project.vo.updateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
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

    @Autowired
    private OperationService operationService;

    @Autowired
    private HoldService holdService;

    @Autowired
    private AttentionService attentionService;

    @Autowired
    StringRedisTemplate redisTemplate;

    @Autowired
    private BrowseService browseService;

    @Autowired
    private SearchService searchService;

    @Autowired
    private MessageService messageService;

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
    @GetMapping("getAllUsers")
    public Result getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new Result(200, users, "获取所有的用户");
    }

    @GetMapping("userDelete")
    public Result UserDelete(String email){
        // 先删除该用户的其他的外键的信息
        attentionService.deleteAtt(email);
        holdService.deleteHold(email);
        operationService.deleteOperation(email);// record
        browseService.deleteBrowse(email);
        feedBackService.deleteFeedBack(email);
        searchService.deleteSearch(email);
        // 删除用户
        userService.deleteUser(email);
        return new Result(200,true,"用户删除成功");
    }

    @PostMapping("setAdmin")
    public Result updateUser(@RequestBody updateUserByAdmin param){
        User user = userService.findUserByEmail(param.getEmail());
        user.setAdmin(param.isAdmin());     // 设置admin权限
        userService.updateUser(user);
        return new Result(200,true,"修改管理员权限成功");
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
        // 处理用户的反
        feedBackService.updateFD(feedBack);
        FeedBack feedBack1 = feedBackService.getFeedBack(feedBack.getUserEmail(), feedBack.getTime());
        messageService.insertMessageTwo(feedBack1);
        return new Result(200, feedBack, "处理用户的某个反馈记录");
    }
}
