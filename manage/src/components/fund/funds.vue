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
                    <el-input placeholder="请输入内容" v-model="searchTxt" class="input-with-select" clearable @clear="cancelSearch">
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
                <el-table-column prop="type" label="基金类型" >
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
                searchTxt:'',
                searchRes:[],
                isSearch:false,
            }
        },
        methods:{
            cancelSearch() {
              this.isSearch = false;
              this.queryInfo.pageIndex = 1;
              this.getGoodsList();
            },
            getGoodsList(){
                if(this.isSearch) {
                    this.searchList();
                } else {
                    this.$http.get('/fund/getFundsNum').then(res=>{
                        console.log(res);
                        this.total = res.data.obj;
                        this.$http.get('/fund/getFundsByPage'+'?pageIndex='+this.queryInfo.pageIndex+'&pageSize='+this.queryInfo.pageSize).then(res=>{
                            console.log(res);
                            this.fundList = res.data.obj;
                        })
                    })
                }

            },
            removeFund(e){
                console.log("fundList",this.fundList);
                console.log("remove",e);
                this.$confirm('是否删除基金'+e.name+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //这里填写删除逻辑，并更新列表
                    console.log("here");
                    this.$http.get('/admin/fundOff?fundCode='+e.code).then(res=>{
                        console.log(res);
                        if(res.data.code===200 && res.data.message==="下架成功") {
                            this.$message.success("下架成功！");
                        } else {
                            this.$message.error("下架失败!");
                        }
                        this.getGoodsList();
                    })
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
                if(this.isSearch===false) {
                    this.isSearch = true;
                    this.queryInfo.pageIndex = 1;
                }
                const ifCode = /^[0-9][0-9][0-9][0-9][0-9][0-9]$/;
                if(this.searchTxt.length===0) {
                    this.isSearch = false;
                    this.queryInfo.pageIndex=1;
                    this.getGoodsList();
                }else if(this.searchTxt.length===6 && ifCode.test(this.searchTxt)) {
                    console.log("根据基金代码查询");
                    this.$http.post('/fund/searchFund',{code:this.searchTxt,name:""}).then(res=>{
                        console.log("查询结果:",res);
                        this.fundList = [res.data.obj];
                        this.total = this.fundList.length;
                        console.log("total",this.total);
                    })
                } else {
                    console.log("根据名称查询");
                    this.$http.post('/fund/searchFund',{name:this.searchTxt}).then(res=>{
                        console.log("查询结果",res);
                        this.searchRes = res.data.obj;
                        this.total = this.searchRes.length;
                        this.fundList = [];
                        let sz = this.queryInfo.pageSize;
                        let idx = this.queryInfo.pageIndex;
                        for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
                            this.fundList.push(this.searchRes[i]);
                        }
                        // this.fundList = res.data.obj;
                        // this.total = this.fundList.length;
                        // console.log("total",this.total);
                        // this.queryInfo.pageSize = this.total;
                    })
                }
            }


        },
        created() {
            this.getGoodsList();
        }
    }
</script>

<style scoped="scoped">
</style>
