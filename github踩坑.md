### github踩坑

github的安全验证手段似乎是改了，需要使用两重验证或者是ssh才能对项目进行clone，仅仅是账号和密码是不行的（我的是这样）

解决办法

**首先需要配置自己的SSH（如果已有可以忽略）**

具体的配置可以看一下这个链接

[SSH配置](https://blog.csdn.net/u013778905/article/details/83501204)

**配置完之后可以试一下本地上传文件**

```
1. 创建一个文件夹
2. 在该文件夹位置打开git
3. git init
4. git clone git@github.com:lwhuagang/softwareProject.git
5. 进入softwareProject的文件夹（可以通过ls查看）
6. 创建一个文件
7. 使用git手段上传（git add，git commit， git push）
8. 结束（之后应该就可以用git上传文件了）
```

