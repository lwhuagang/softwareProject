<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 主体内容	 -->
		<el-card>
			<!-- 列表用户内容区域	 -->
			<el-table :data="userList" border style="width: 100%">
				<el-table-column type="index" width="180">
				</el-table-column>
				<el-table-column prop="nickname" label="用户名" width="180">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="money" label="账户余额" width="180">
				</el-table-column>
				<el-table-column prop="tmpAdmin" label="角色" width="180">
				</el-table-column>
				<el-table-column prop="address" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserlist(scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row)"></el-button>
						<el-tooltip class="item" effect="dark" content="分配角色" placement="top">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="editRole(scope.row)"   ></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

		</el-card>


      <el-dialog align="left" title="修改用户" :visible.sync="editUserVisible" width="50%" >
      	<!--主体部分 -->
      	<el-form :model="param" status-icon  ref="editUserFormRel" label-width="100px" class="demo-ruleForm">
			<el-form-item label="邮箱" >
				<el-input v-model="param.email" disabled></el-input>
			</el-form-item>
      		<el-form-item label="用户名" >
      			<el-input  v-model="param.name"></el-input>
      		</el-form-item>

			<el-form-item label="账户余额" >
				<el-input v-model="param.money"></el-input>
			</el-form-item>
      	</el-form>
      	<span slot="footer" class="dialog-footer">
      		<el-button @click="editUserVisible = false">取 消</el-button>
      		<el-button type="primary" @click="editUser">确 定</el-button>
      	</span>
      </el-dialog>
    
	<!-- 分配角色dialog -->
	
	<!-- 修改用户diaolog对话框 -->
	 
	 <el-dialog align="left" title="分配角色" :visible.sync="editRoleVisible" width="50%" >
	 	<!--主体部分 -->
	 	<div>
			<p>当前的用户:<strong>{{currentname}}</strong></p>
			<p>当前的角色:<strong>{{currentRol}}</strong></p>
			<span>分配新角色:</span> <el-select v-model="selectVal" slot="prepend" placeholder="请选择">
								  <el-option label="普通用户" value="普通用户"></el-option>
								  <el-option label="管理员" value="管理员"></el-option>
								</el-select>
		</div>
		
	 	<span slot="footer" class="dialog-footer">
	 		<el-button @click="editRoleVisible = false">取 消</el-button>
	 		<el-button type="primary" @click="editRollist">确 定</el-button>
	 	</span>
	 </el-dialog>

		<el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="pageIndex"
					   :page-sizes="[1,2,5,10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageSize:10,
				pageIndex:1,
				tmpList:[],
				total:0,
				//用户列表
				userList: [
				],
				//添加用户dialog,控制显示隐藏
				addUserVisible: false,
				param:{
					name: '',
					email: '',
					money: 0,
					avatarLink:'',
					// admin:false,
				},
				//修改用户dialog,控制显示隐藏
				editUserVisible: false,
				//角色对话框
				editRoleVisible:false,
				//分配角色
				selectVal:'',
				//当前用户
				currentname:'',
				//当前的角色
				currentRol:'',
			}
		},
		mounted() {
			this.getUserList();
		},
		methods: {
			SizeChange(newSize){
				this.pageSize = newSize;
				let sz = this.pageSize;
				let idx = this.pageIndex;
				this.userList=[]
				for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
					this.userList.push(this.tmpList[i]);
				}
			},
			CurrentChange(newPage){
				this.pageIndex = newPage;
				let sz = this.pageSize;
				let idx = this.pageIndex;
				this.userList=[]
				for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
					this.userList.push(this.tmpList[i]);
				}
			},
			//请求用户列表
			getUserList() {
				this.$http.get('/admin/getAllUsers').then(res=>{
					console.log(res);
					this.tmpList = res.data.obj;
					for(let i=0;i<this.tmpList.length;++i) {
						this.tmpList[i].tmpAdmin = (this.tmpList[i].admin===false)?("普通用户"):("管理员");
					}
					this.total = this.tmpList.length;
					this.userList=[];
					let sz = this.pageSize;
					let idx = this.pageIndex;
					for(let i=sz*(idx-1);i<sz*idx && i<this.total;++i) {
						this.userList.push(this.tmpList[i]);
					}
				})
			},
			//删除用户
			removeUser(e) {
				console.log("E:",e)
				this.$confirm('是否删除用户'+e.nickname+'?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//这里填写删除逻辑，并更新列表
					console.log(e);
					let mail = e.email;
					console.log("mail:",mail);
					this.$http.get('/admin/userDelete?email='+mail).then(res=>{
						console.log("res:",res);
						if(res.data.code===200 && res.data.message==="用户删除成功") {
							this.$message.success("用户删除成功!");
							this.getUserList();
						} else {
							this.$message.error("用户删除失败!");
							this.getUserList();
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//修改用户信息事件
			editUserlist(item){
				this.editUserVisible = !this.editUserVisible;
				// console.log("item:",item);
				this.param={
					name:item.nickname,
					email: item.email,
					money:item.money,
					avatarLink: ''
				}
			},
			//点击确定发送请求修改用户信息
			editUser(){
				console.log("param==>",this.param);
				this.$http.post('/user/update',this.param).then(res=>{
					console.log(res);
					if(res.data.code===200 && res.data.message==="用户信息修改成功!") {
						this.$message.success("用户信息修改成功!");
						this.getUserList();
					} else {
						this.$message.error("用户信息修改失败!");
					}
					this.editUserVisible = !this.editUserVisible;
				})
			},
			//编辑角色事件
			editRole(row){
				console.log("ROW:",row);
				this.editRoleVisible = !this.editRoleVisible;
				this.currentRol = row.tmpAdmin;
				this.currentname = row.nickname;
				this.param.admin = row.admin;
				this.param.email = row.email;
			},
			editRollist(){
				//分配用户角色
				console.log(this.selectVal);
				this.param.admin=(this.selectVal !== '普通用户');
				console.log(this.param);
				this.$http.post('/admin/setAdmin',this.param).then(res=>{
					console.log(res);
					if(res.data.code===200 && res.data.message==="修改管理员权限成功") {
						this.$message.success("权限修改成功!");
						this.getUserList();
					} else {
						this.$message.error("权限修改失败!");
					}
					this.editRoleVisible = !this.editRoleVisible;
				});
			}

		},
		// created() {
		// 	this.$http.post('/admin/setAdmin',{email:this.param.email,admin:this.param.admin}).then(res=>{
		// 		console.log(res);
		// 		if(res.data.code===200 && res.data.message==="修改管理员权限成功") {
		// 			this.$message.success("权限修改成功!");
		// 			this.getUserList();
		// 		} else {
		// 			this.$message.error("权限修改失败!");
		// 		}
		// 		this.editRoleVisible = !this.editRoleVisible;
		// 	});
		// }
	}
</script>

<style>
</style>
