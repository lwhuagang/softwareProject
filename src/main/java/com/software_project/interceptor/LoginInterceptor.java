package com.software_project.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//登录页面拦截器,没有登陆的情况下不允许访问博客后台页面
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        if (request.getSession().getAttribute("user") == null){
            //user为空 说明未登录,此时重定向到登录页面
            response.sendRedirect("/user");
            return false;
        }
        return true;
    }
}
