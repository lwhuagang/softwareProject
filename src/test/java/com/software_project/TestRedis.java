package com.software_project;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
public class TestRedis {

    @Autowired
    StringRedisTemplate redisTemplate;

    @Test
    public void demo1() {
        //从右边插入，即插入到列表头部
        redisTemplate.opsForList().rightPush("18231106:000001", "1");
        redisTemplate.opsForList().rightPush("18231106:000001", "2");
        redisTemplate.opsForList().rightPush("18231106:000001", "3");
        redisTemplate.opsForList().rightPush("18231106:000001", "4");
    }

    @Test
    public void demo2() {
        //从左边插入一个数组
        String[] books = new String[] {"java编程思想", "springboot从入门到精通"};
        redisTemplate.opsForList().leftPushAll("book:list", books);
    }

    @Test
    public void demo3() {
        //从左边插入一个集合
        List<String> list = new ArrayList<String>();
        list.add("鬼泣5");
        list.add("荒野大镖客2");
        list.add("仙剑奇侠传7");
        redisTemplate.opsForList().leftPushAll("game:list", list);
    }

    @Test
    public void demo4() {
        //如果存在key对应的列表，则从左插入，不存在不做操作
        redisTemplate.opsForList().leftPushIfPresent("fruit:list", "1");
    }

    @Test
    public void demo5() {
        //在key对应的列表中从左边开始找，找到第一个pivot，然后把value插到pivot左边，没有不做操作
        redisTemplate.opsForList().leftPush("product:list", "HuaWei Mate20X", "xiaomi mix");
    }

    //也可以从右边插入，把上面的left改为right即可

    @Test
    public void demo6() {
        //指定位置重新设置指定值
        redisTemplate.opsForList().set("product:list", 1, "dell xps13");
    }

    @Test
    public void demo7() {
        //删除和value相同的count个元素，count < 0，从右开始,count > 0，从左开始,count = 0，全部
        redisTemplate.opsForList().remove("product:list", -1, "HuaWei Mate20 pro");
    }

    @Test
    public void demo8() {
        //获取制定下标对应的值 index,从0开始，有正负两套下标
        //[a,b,c,d] 下标有[0,1,2,3]和[0,-3,-2,-1];
        String value = redisTemplate.opsForList().index("product:list", 1);
        System.out.println(value);
    }

    @Test
    public void demo9() {
        //查询list中指定范围的内容
        List<String> list = redisTemplate.opsForList().range("product:list", 0, -1);
        System.out.println(list);

        //修剪列表，使其只包含指定范围内的元素
        redisTemplate.opsForList().trim("product:list", 0, 2);

        //查询列表长度
        System.out.println(redisTemplate.opsForList().size("product:list"));
    }

    @Test
    public void demo10() {
        //弹出最左边元素
        redisTemplate.opsForList().leftPop("product:list");
        //移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时。
        redisTemplate.opsForList().leftPop("k1", 10, TimeUnit.SECONDS);


        //弹出最右边元素
        redisTemplate.opsForList().rightPop("product:list");

        //弹出k1最右边元素并放入k2最左边
        redisTemplate.opsForList().rightPopAndLeftPush("product:list", "game:list");
    }
}
