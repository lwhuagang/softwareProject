<template>
  <div class="home-container">
    <el-container>
      <el-header class="el-header">
        <div>
          <img src="../assets/logo.png"  />
          <span>螺旋直升基后台管理系统</span>
        </div>

        <el-button @click="loginOut" type="primary" size="medium" class="logOutBtn">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '60px':'200px'">
          <div style="color: #fff;" @click="isCollapse=!isCollapse">|||</div>
          <!-- 导航菜单 -->
          <el-menu
                  default-active="2"
                  class="el-menu-vertical-demo"
                  background-color="#333744"
                  text-color="#fff"
                  :unique-opened="true"
                  :collapse="isCollapse"
                  :router="true"
                  :default-active="activePath"
                  :collapse-transition="false"
                  active-text-color="#ffd04b"   >
            <el-menu-item :index="'/users'">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
            </el-menu-item>
            <el-submenu :index="'/unsolvedMsg'">
              <template slot="title">
                <i class="el-icon-message"></i>
                <span>用户反馈</span>
              </template>
              <el-menu-item :index="'/unsolvedMsg'">
                <template slot="title">
                  <i class="el-icon-warning-outline"></i>
                  <span>未处理</span>
                </template>
              </el-menu-item>
              <el-menu-item :index="'/solvedMsg'">
                <template slot="title">
                  <i class="el-icon-circle-check"></i>
                  <span>已处理</span>
                </template>
              </el-menu-item>
            </el-submenu>

            <el-menu-item :index="'/funds'">
              <template slot="title">
                <i class="el-icon-goods"></i>
                <span>基金管理</span>
              </template>
            </el-menu-item>
<!--            <el-submenu :index="item.id+''" v-for="item in menulists" :key="item.id">-->
<!--              <template slot="title">-->

<!--                <i :class="objicon[item.id]"></i>-->
<!--                <span>{{item.authName}}</span>-->
<!--              </template>-->
<!--              <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children"  :key="item2.id" @click="activeSave('/'+item2.path)"   >-->
<!--                <template slot="title">-->
<!--                  <i class="el-icon-menu"></i>-->
<!--                  <span> {{item2.authName}}</span>-->
<!--&lt;!&ndash;                  index属性写明了跳转的地址&ndash;&gt;-->
<!--                </template>-->
<!--              </el-menu-item>-->
<!--            </el-submenu>-->

          </el-menu>

        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    data(){
      return {
        // //左侧菜单
        // menulists:[
        //   {
        //     id:125,
        //     authName:"用户管理",
        //     children:[
        //       {
        //         path:"users",
        //         authName:"用户信息"
        //       },
        //       {
        //         path:"userMessage",
        //         authName: "用户反馈"
        //       }
        //     ]
        //   },
        //   {
        //     id:103,
        //     authName: "基金管理",
        //     children: [
        //       {
        //         path:"fundInfo",
        //         authName:"基金管理"
        //       }
        //     ]
        //   }
        // ],
        // objicon:{
        //   "125":'iconfont icon-icon_user',
        //   "103":'iconfont icon-shangpin',
        //   "101":'iconfont icon-danju',
        //   "102":'iconfont icon-tijikongjian',
        //   "145":'iconfont icon-baobiao'
        // },
        //是否水平折叠菜单
        isCollapse:false,
        //当前激活的路径
        activePath:''

      }
    },
    methods:{
      //退出登录
      loginOut(){
        window.sessionStorage.clear();
        this.$router.push({path:'/login'})
      },
      //点击导航，有激活的状态
      activeSave(path){
        this.activePath = path;
        window.sessionStorage.setItem('activePath',path);
      }
    },
    created() {
      //导航激活的状态
      this.activePath = window.sessionStorage.getItem('activePath');
      // //获取左侧菜单
      // this.$http.get('menus').then(res=>{
      //   console.log(res);
      //   if(res.data.meta.status!==200) return this.$message.error('请求数据失败！');
      //   this.$message.success('请求成功！');
      //   this.menulists = res.data.data;
      //
      // })
    }

  }
</script>

<style scoped="scoped">
  .home-container{
    height: 100%;
    background: #c4c4c4;
  }
  .el-container{
    height: 100%;
  }
  .logOutBtn{
    height: 50%;
    align-self: center;
  }
  .el-header{
    background: #333744;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 20px;
  }
  .el-header img{
    vertical-align: middle;
    width: 60px;
    height: 65px;
  }
  .el-aside{
    background: #333744;
    height: 100%;
    box-sizing: border-box;
  }
  .el-main{
    background: #ececec;
  }
</style>

<!--<template>-->
<!--  <div class="home">-->
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--// @ is an alias to /src-->
<!--import HelloWorld from '@/components/HelloWorld.vue'-->

<!--export default {-->
<!--  name: 'Home',-->
<!--  components: {-->
<!--    HelloWorld-->
<!--  }-->
<!--}-->
<!--</script>-->
