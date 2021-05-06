### 将首部导航栏固定的方法:

* 注意结构

* 以newFund为例:

  * ```html
    <!--pages/newFund/newFund.wxml-->
    <view class="container">
    
    </view>
    <view class="head">
      <naviBar title="新发基金"></naviBar>
    </view>
    ```

  * ```css
    /* pages/newFund/newFund.wxss */
    .head{
      position: fixed;
      width: 100%;
      height: 100rpx;
      margin-top:0;
    }
    .container{
      position: absolute;
      width: 100%;
      margin-top:130rpx;
    }
    ```

  * 注意以上container中的内容有但不一定仅有这三个。