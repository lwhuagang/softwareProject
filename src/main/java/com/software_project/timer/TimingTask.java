package com.software_project.timer;

import com.software_project.controller.OperationController;
import com.software_project.controller.UserController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TimingTask {
    @Autowired
    OperationController operationController;

    @Autowired
    UserController userController;
    /**
     *  工作日的每天晚上九点执行一次
     */
    @Scheduled(cron="0 30 21 ? * MON-FRI")
    public void executeFileDownLoadTask() {
        userController.calculate();
        operationController.update();
    }
}