<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 主体内容	 -->
		<el-card>
			<!-- 搜索区域 -->
			<el-row>
				<el-col :span="6">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" @click="addDialog">添加用户</el-button>
				</el-col>
			</el-row>

			<!-- 列表用户内容区域	 -->
			<el-table :data="userList" border style="width: 100%">
				<el-table-column type="index" width="180">
				</el-table-column>
				<el-table-column prop="username" label="用户名" width="180">
				</el-table-column>
				<el-table-column prop="email" label="邮箱">
				</el-table-column>
				<el-table-column prop="mobile" label="账户余额" width="180">
				</el-table-column>
				<el-table-column prop="role_name" label="角色" width="180">
				</el-table-column>
<!--				<el-table-column prop="mg_state" label="状态">-->
<!--					<template slot-scope="scope">-->
<!--						<el-switch v-model="scope.row.mg_state" @change="editStatus(scope.row.id,scope.row.mg_state)"> </el-switch>-->
<!--					</template>-->
<!--				</el-table-column>-->
				<el-table-column prop="address" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserlist(scope.row)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
						<el-tooltip class="item" effect="dark" content="分配角色" placement="top">
							<el-button type="warning" icon="el-icon-setting" size="mini" @click="editRole(scope.row)"   ></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页功能 -->
			<el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="queryInfo.pagenum"
			 :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>


		<!-- 添加用户dialog对话框 -->

		<el-dialog align="left" title="添加用户" :visible.sync="addUserVisible" width="50%" @close="closeAdduserDialog"  >
			<!--主体部分 -->
			<el-form :model="addUserForm" status-icon ref="addUserFormRel" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="username">
					<el-input  v-model="addUserForm.username" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addUserForm.email"></el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="addUserVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUserList">确 定</el-button>
			</span>
		</el-dialog>

     <!-- 修改用户diaolog对话框 -->
      
      <el-dialog align="left" title="修改用户" :visible.sync="editUserVisible" width="50%" >
      	<!--主体部分 -->
      	<el-form :model="editUserForm" status-icon  ref="editUserFormRel" label-width="100px" class="demo-ruleForm">
      		<el-form-item label="用户名" >
      			<el-input  v-model="editUserForm.username"  autocomplete="off"></el-input>
      		</el-form-item>
      		<el-form-item label="邮箱" >
      			<el-input v-model="editUserForm.email"></el-input>
      		</el-form-item>
			<el-form-item label="账户余额" >
				<el-input v-model="editUserForm.email"></el-input>
			</el-form-item>

      	</el-form>
      
      	<span slot="footer" class="dialog-footer">
      		<el-button @click="editUserVisible = false">取 消</el-button>
      		<el-button type="primary" @click="editUser">确 定</el-button>
      	</span>
      </el-dialog>
    
	<!-- 分配角色dialog -->
	
	<!-- 修改用户diaolog对话框 -->
	 
	 <el-dialog align="left" title="修改用户" :visible.sync="editRoleVisible" width="50%" >
	 	<!--主体部分 -->
	 	<div>
			<p>当前的用户:<strong>{{currentname}}</strong></p>
			<p>当前的角色:<strong>{{currentRol}}</strong></p>
			<span>分配新角色:</span> <el-select v-model="selectVal" slot="prepend" placeholder="请选择">
								  <el-option label="王者" value="王者"></el-option>
								  <el-option label="黄铜" value="黄铜"></el-option>
								  <el-option label="钻石" value="钻石"></el-option>
								</el-select>
		</div>
		
	 	<span slot="footer" class="dialog-footer">
	 		<el-button @click="editRoleVisible = false">取 消</el-button>
	 		<el-button type="primary" @click="editRollist">确 定</el-button>
	 	</span>
	 </el-dialog>
	   
	  

	</div>
</template>

<script>
	export default {
		data() {
			//验证邮箱的规则
			var checkEmail = (rule, value, cb) => {
				const regEmail = /^\w+@\w+(\.\w+)+$/
				if (regEmail.test(value)) {
					return cb()
				}
				//返回一个错误提示
				cb(new Error('请输入合法的邮箱'))
			}
			//验证手机号码的规则
			var checkMobile = (rule, value, cb) => {
				const regMobile = /^1[345789]\d{9}$/
				if (regMobile.test(value)) {
					return cb()
				}
				//返回一个错误提示
				cb(new Error('请输入合法的手机号码'))
			}


			return {
				//搜索的neirong
				searchVal: '',
				//用户列表参数
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 2
				},
				//用户列表
				userList: [
					{

					},
					{

					}
				],
				//总的数据条数
				total: 0,
				//添加用户dialog,控制显示隐藏
				addUserVisible: false,
				//添加用户参数
				addUserForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				},
				//添加用户规则
				addUserFormRul: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 6,
							message: '长度为6个字符',
							trigger: 'blur'
						}
					],
					email: [{ validator: checkEmail, trigger: 'blur' }],										
					mobile: [ { validator: checkMobile, trigger: 'blur' }]
				},
				//修改用户参数
				editUserForm:{
					username: '',					
					email: '',
					mobile: '',
					id:''
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
				id:'',
				rid:''
				
			}
		},
		mounted() {
			this.getUserList();
		},
		methods: {
			//请求用户列表
			getUserList() {
				this.$http.get('users', {
						params: this.queryInfo
					})
					.then(res => {
						//console.log(res);
						if (res.data.meta.status !== 200) return this.$message.error('获取用户列表失败！');
						this.$message.success('获取列表成功！');
						this.userList = res.data.data.users;
						this.total = res.data.data.total;
					})
			},
			//每页数据条数改变时触发
			SizeChange(newval) {
				this.queryInfo.pagesize = newval;
				this.getUserList();
			},
			//当前页面改变时触发
			CurrentChange(newval) {
				this.queryInfo.pagenum = newval;
				this.getUserList();
			},
			//修改用户状态
			editStatus(id, status) {
				this.$http.put(`users/${id}/state/${status}`)
					.then(res => {
						//console.log(res);
						if (res.data.meta.status !== 200) return this.$message.error('设置状态失败！');
						this.$message.success('更新状态成功！');
						//更新列表
						this.getUserList();
					})
			},
			//删除用户
			removeUser(id) {
				this.$http.delete(`users/${id}`)
					.then(res => {
						//console.log(res);
						if (res.data.meta.status == 400) return this.$message.warning('不允许删除！');
						if (res.data.meta.status !== 200) return this.$message.error('删除用户失败');

						this.$message.success('删除用户成功！');

						//刷新列表
						this.getUserList();
					})
			},
			//点击添加新用户
			addDialog() {
				this.addUserVisible = !this.addUserVisible;
			},
			//点击确定发送添加新用户接口
			addUserList(){
				this.$refs.addUserFormRel.validate(valid=>{
					//校验规则全部正确向后台发送请求
					if(!valid) return;
					this.$http.post('users',this.addUserForm).then(res=>{
						//console.log(res);
						if(res.data.meta.status!==201) return this.$message.error('添加用户失败！');
						this.$message.success('添加用户成功！');
						//刷新列表
						this.getUserList();
						this.addUserVisible = !this.addUserVisible;
					})
				})
				// this.$refs.addUserFormRel.validateField(function(['username','passworld'],err=>{
				// 	console
				// })
					
				
					
				
			},
			//关闭添加用户对话框，重置表单
			closeAdduserDialog(){
				this.$refs.addUserFormRel.resetFields();
			},
			//修改用户信息事件
			editUserlist(item){
				this.editUserVisible = !this.editUserVisible;
				this.editUserForm={
					username:item.username,					
					email: item.email,
					mobile: item.mobile,
					id:item.id
				}
			},
			//点击确定发送请求修改用户信息
			editUser(){
				this.$http.put(`users/${this.editUserForm.id}`,{email:this.editUserForm.email,mobile:this.editUserForm.mobile}).then(res=>{
					//console.log(res);
					if(res.data.meta.status!==200) return this.$message.error("修改用户信息失败！");
					 this.$message.success("修改用户信息成功！");
					 this.getUserList();
					 this.editUserVisible = !this.editUserVisible;
				})
			},
			//编辑角色事件
			editRole(row){
				console.log(row);
				this.editRoleVisible = !this.editRoleVisible;
				this.currentRol = row.role_name;
				this.currentname = row.username;
				this.id= row.id;
				//获取角色id
				this.$http.get(`users/${row.id}`).then(res=>{
					//console.log(res);
					 this.rid = res.data.data.rid;
				})

			},
			editRollist(){
				//分配用户角色
				this.$http.put(`users/${this.id}/role`,{rid:this.rid})
				.then(res=>{
					console.log(res);
					if(res.data.meta.status!==200) return this.$message.error("分配角色失败！");
					 this.$message.success("分配角色成功！");
				})
				
				this.getUserList();				
				this.editRoleVisible = !this.editRoleVisible;
			}
			
			
			

		}
	}
</script>

<style>
</style>
