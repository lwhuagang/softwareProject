package com.software_project.timer;

import com.software_project.controller.AdminController;
import com.software_project.controller.*;
import com.software_project.controller.OperationController;
import com.software_project.controller.UserController;
import com.software_project.pojo.User;
import com.software_project.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.List;

@Component
public class TimingTask {
    @Autowired
    OperationController operationController;

    @Autowired
    UserController userController;

    @Autowired
    MessageController messageController;

    @Autowired
    AdminController adminController;
    /**
     *  工作日的每天晚上九点执行一次
     */
    //@Scheduled(cron="0 30 21 ? * MON-FRI")
    @Scheduled(cron = "0/5 * * * * ?")
    public void executeFileDownLoadTask() throws ParseException {
        userController.calculate();
        operationController.update();

        List<User> allUsers = (List<User>)adminController.getAllUsers().getObj();       // 取出所有的用户
        for (User allUser : allUsers) {     // 处理所有用户的基金推送消息
            messageController.addFundMsg2(allUser.getEmail());
        }
    }
}