<template>
    <div>
        <!-- 面包屑内容 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基金管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索区域 -->
            <el-row>
                <el-col :span="6">
                    <el-input placeholder="请输入内容" v-model="searchTxt" class="input-with-select" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
                    </el-input>
                </el-col>
<!--                <el-col :span="2">-->
<!--                    <el-button type="primary" @click="addGoods">添加商品</el-button>-->
<!--                </el-col>-->
            </el-row>

            <!-- 列表用户内容区域	 -->
            <el-table :data="fundList" border style="width: 100%">
<!--                <el-table-column type="index" width="180">-->
<!--                </el-table-column>-->
                <el-table-column prop="code" label="基金代码" >
                </el-table-column>
                <el-table-column prop="name" label="基金名称">
                </el-table-column>
                <el-table-column prop="fundType" label="基金类型" >
                </el-table-column>
<!--                <el-table-column prop="add_time" label="创建时间" >-->
<!--                </el-table-column>-->
                <el-table-column prop="code" label="操作">
                    <template slot-scope="scope">
<!--                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserlist(scope.row)"></el-button>-->
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeFund(scope.row)"></el-button>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能 -->
            <el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="queryInfo.pageIndex"
                           :page-sizes="[1,2,5,10]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>





    </div>
</template>

<script>
    export default {
        data(){
            return {
                queryInfo:{
                    pageIndex:1,
                    pageSize:10
                },
                //商品列表
                fundList:[],
                GoodsList:[{}],
                //总的数据条数
                total:0,
                totalPages:0,
                searchTxt:''
            }
        },
        methods:{
            getGoodsList(){
                //首先要获得总共有多少条
                //这里应该改为从数据库中获取所有的基金
                this.$http.post('https://api.doctorxiong.club/v1/fund/rank',this.queryInfo).then(res=>{
                    console.log(res);
                    this.fundList = res.data.data.rank;
                })
                // this.$http.get('goods',{params:this.queryInfo})
                //     .then(res=>{
                //         //console.log(res);
                //         this.GoodsList = res.data.data.goods;
                //         this.total = res.data.data.total;
                //     })
            },
            // //添加商品
            // addGoods(){
            //     this.$router.push('/goods/add');
            // },
            // //点击编辑按钮
            // editUserlist(){
            //
            // },
            //点击删除按钮
            removeFund(e){
                console.log(e);
                this.$confirm('是否删除基金'+e.name+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //这里填写删除逻辑，并更新列表
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //当页面数据条数发生改变的时候
            SizeChange(newSize){
                this.queryInfo.pageSize = newSize;
                this.getGoodsList();
            },
            //当前页码发生改变的时候触发
            CurrentChange(newPage){
                this.queryInfo.pageIndex = newPage;
                this.getGoodsList();
            },
            searchList() {
                const ifCode = /^[0-9][0-9][0-9][0-9][0-9][0-9]$/;
                if(this.searchTxt.length===6 && ifCode.test(this.searchTxt)) {
                    console.log("根据基金代码查询");
                    this.$http.post('/fund/searchFund',{code:this.searchTxt,name:""}).then(res=>{
                        console.log("查询结果:",res);
                        this.fundList = [res.data.obj];
                    })
                } else {
                    console.log("根据名称查询");
                    this.$http.post('/fund/searchFund',{name:this.searchTxt}).then(res=>{
                        console.log("查询结果",res);
                        this.fundList = res.data.obj;
                        for(let i=0; i<this.fundList.length; ++i) { //一个是type一个是fundType
                            this.fundList[i].fundType = this.fundList[i].type;
                        }
                    })
                }
            }


        },
        created() {
            // this.$http.get('/fund/getFundsNum').then(res=>{
            //     console.log("数量",res.data.obj);
            //     this.total = res.data.obj;
            //     this.$http.get('/fund/getFundsByPage',this.queryInfo).then(res=>{
            //         console.log(res);
            //     })
            // })
            this.$http.post('https://api.doctorxiong.club/v1/fund/rank',this.queryInfo).then(res=>{
                console.log(res);
                this.fundList = res.data.data.rank;
                this.totalPages = res.data.data.allPages;
                this.$http.post('https://api.doctorxiong.club/v1/fund/rank',{pageIndex:this.totalPages,token:"atTPd9c8sA"}).then(res=>{
                    this.total = (this.totalPages-1)*10+res.data.data.rank.length;
                    console.log(res)
                })
            })
        }
    }
</script>

<style scoped="scoped">
</style>
