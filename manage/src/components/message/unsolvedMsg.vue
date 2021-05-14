<template>
    <div>
        <!-- 面包屑内容 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户反馈</el-breadcrumb-item>
            <el-breadcrumb-item>未处理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 列表用户内容区域	 -->
            <el-table :data="msgList" border style="width: 100%">
                <el-table-column prop="userEmail" label="用户邮箱" >
                </el-table-column>
                <el-table-column prop="message" label="反馈信息">
                </el-table-column>
                <el-table-column prop="index" label="操作">
                    <template slot-scope="scope">
                        <!--                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserlist(scope.row)"></el-button>-->
                        <el-button type="warning" icon="el-icon-edit-outline" size="mini" @click="solve(scope.row)"></el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="处理" :visible.sync="dialogVisible">
                <el-form :model="solveRst">
                    <el-form-item label="用户邮箱" :label-width="formLabelWidth">
                        {{solveRst.userEmail}}
                    </el-form-item>
                    <el-form-item label="用户反馈" :label-width="formLabelWidth">
                        {{solveRst.message}}
                    </el-form-item>
                    <el-form-item label="处理" :label-width="formLabelWidth">
                        <el-input v-model="solveRst.result" autocomplete="off"   type="textarea" :rows="2" placeholder="请输入内容"
                                  ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSolve">取 消</el-button>
                    <el-button type="primary" @click="subSolve">确 定</el-button>
                </div>
            </el-dialog>

            <el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="pageIndex"
                           :page-sizes="[1,2,5,10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                pageSize:10,
                pageIndex:1,
                //消息列表
                msgList:[],
                tmpList:[],
                //总的数据条数
                total:0,
                dialogVisible:false,
                formLabelWidth: '120px',
                solveRst:{
                    userEmail:'',
                    time:'',
                    message:'',
                    flag:false,
                    result:'',
                }
            }
        },
        methods:{
            SizeChange(newSize){
                this.pageSize = newSize;
                let sz = this.pageSize;
                let idx = this.pageIndex;
                this.msgList=[]
                for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
                    this.msgList.push(this.tmpList[i]);
                }
            },
            CurrentChange(newPage){
                this.pageIndex = newPage;
                let sz = this.pageSize;
                let idx = this.pageIndex;
                this.msgList=[]
                for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
                    this.msgList.push(this.tmpList[i]);
                }
            },
            cancelSolve(){
                this.dialogVisible = false;
            },
            subSolve(){
                this.solveRst.flag = true;
                console.log("处理结果==>",this.solveRst);
                this.$http.post('/admin/updateFD',this.solveRst).then(res=>{
                    console.log(res);
                    this.getUnsolvedMsg();
                    this.dialogVisible = false;
                });
            },
            solve(e){
                console.log("点击==>",e);
                this.dialogVisible = true;
                this.solveRst.message = e.message;
                this.solveRst.time = e.time;
                this.solveRst.userEmail = e.userEmail;
                this.solveRst.result='';
                console.log("solve==>",this.solveRst)
            },
            getUnsolvedMsg(){
                this.$http.get('/admin/getAllFDNo').then(res=>{
                    console.log(res);
                    this.tmpList = res.data.obj;
                    this.total = this.tmpList.length;
                    this.msgList = [];
                    let sz = this.pageSize;
                    let idx = this.pageIndex;
                    for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
                        this.msgList.push(this.tmpList[i]);
                    }
                })
            },

        },

        created() {
            this.getUnsolvedMsg();
        }
    }
</script>

<style>

</style>
