<template>
	<div>
		<!-- 面包屑内容 -->
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>权限管理</el-breadcrumb-item>
				<el-breadcrumb-item>角色列表</el-breadcrumb-item>
			</el-breadcrumb>
			
			<!-- 主体table -->
		<el-card>	
			<el-table
			    :data="rolesList"
			    border
			    style="width:100%">
			    <el-table-column
			      type="expand"
			      >
				<template slot-scope="scope">
					<el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['bdbottom',index==0?'bdtop':'']">
						<!-- 循环渲染第一层数据 -->
						<el-col>
							<el-tag  closable type="primary" @close="removeRight(scope.row,item1.id)" >{{item1.authName}}</el-tag>
							<i class="el-icon-caret-right"></i>
						</el-col>

						<el-col>
							<el-row v-for="item2 in item1.children" :key="item2.id" class="bdbottom" >
								<el-col>
									<el-tag  closable type="success" @close="removeRight(scope.row,item2.id)" >{{item2.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								
								<el-col v-for="item3 in item2.children" :key="item3.id">
									<el-tag  closable type="warning" @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								
							</el-row>
							
							
							
						</el-col>
					</el-row>
					
					
				</template>  
	  
			    </el-table-column>
			    <el-table-column
			      type="index"
			      >
			    </el-table-column>
			    <el-table-column
			      prop="roleName"
			      label="角色名称" >
			    </el-table-column>
				<el-table-column
				  prop="roleDesc"
				  label="角色描述" >
				</el-table-column>
				<el-table-column
				  prop="level"
				  label="操作"
				  >
				  <template slot-scope="scope">
					   <el-button type="primary" icon="el-icon-edit" size='small' >编辑</el-button>										
					   <el-button type="danger" icon="el-icon-delete" size='small' @click="removeRole(scope.row.id)" >删除</el-button>					    
					  <el-button type="warning" icon="el-icon-setting" size='small' @click="showRoleVisible(scope.row)">分配角色</el-button>
				  </template>
				</el-table-column>
			  </el-table>
			</el-card>
		
		
	<!-- 分配角色dialog对话框	 -->
	<el-dialog
	  title="分配角色"
	  :visible.sync="RoleVisible"
	  width="30%"
	  >
	 <!-- 主体部分 -->
	 <el-tree
	   :data="treeRightsList"
	   show-checkbox
	   node-key="id"
	   :props="treeprops"
	   default-expand-all
	   :default-checked-keys="checkedTreeKeys"
	   ref="treeRel"
	  >
	 </el-tree>
	 
	 
	 
	 
	 
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="RoleVisible = false">取 消</el-button>
	    <el-button type="primary" @click="sureRights">确 定</el-button>
	  </span>
	</el-dialog>	
		
		<!-- :default-expanded-keys="[2, 3]"
		:default-checked-keys="[5]"
		:props="defaultProps"	 -->
			
	</div>
</template>

<script>
	
	export default{
		data(){
			return {
				rolesList:null,
				//分配角色dialog，控制显示隐藏
				RoleVisible:false,
				//树形权限列表
				treeRightsList:null,
				//树形dialog，props树形
				treeprops:{
					//节点名字
					label:"authName",
					//子节点
					children:'children'
				},
				//默认选中的节点，
				checkedTreeKeys:[],
				//保存角色id
				roleId:''
			}
		},
		methods:{
			//获取当前角色列表
			getRoleslist(){
				this.$http.get('roles').then(res=>{
					//console.log(res);
					if(res.data.meta.status!==200) return this.$message.error('请求角色列表失败！');
					this.$message.success('请求角色列表成功！');
					this.rolesList = res.data.data;
					
				})
			},
			//删除当前角色
			removeRole(id){
				this.$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							this.$http.delete(`roles/${id}`).then(res=>{
								//console.log(res);
							if(res.data.meta.status!==200) return 	this.$message.error('删除角色失败！');
							
								this.$message.success('删除角色成功！');								
								this.getRoleslist()
							})
				         
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除角色'
				          });          
				        });
										
			},
			//删除指定角色
			removeRight(role,RightId){
				//console.log(typeof role.id)
				this.$confirm('此操作将永久删除该权限, 是否继续?', '删除指定权限', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							this.$http.delete(`roles/${role.id}/rights/${RightId}`).then(res=>{
								//console.log(res);
							if(res.data.meta.status!==200) return 	this.$message.error('删除角色失败！');
							
								this.$message.success('删除角色成功！');								
								//this.getRoleslist()
								//更新当前角色的权限
								role.children = res.data.data;
							})
				         
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除角色'
				          });          
				        });
			},
			//点击分配角色按钮，弹出dialog对话框
			showRoleVisible(roles){
				//先保存角色id，后边角色授权的时候使用
				this.roleId = roles.id;
				this.RoleVisible = !this.RoleVisible;
				//获取树形权限列表
				this.$http.get('rights/tree').then(res=>{
					//console.log(res)
					this.treeRightsList = res.data.data;					
				})
				this.getThirdNodes(roles,this.checkedTreeKeys)
			},
		  getThirdNodes(role,arr){
			  //没有children说明是最后一个节点
			  if(!role.children){
				  return arr.push(role.id);
			  }
			 
			 role.children.forEach(item=>this.getThirdNodes(item,arr));
			  
		  },
		// 点击确定按钮,发送后台数据	  
			sureRights(){
				
				//获取所有的权限 ID 列表
				var  ridsKeys = [
					...this.$refs.treeRel.getCheckedKeys(),
					...this.$refs.treeRel.getHalfCheckedKeys()
				]
			  var rids = ridsKeys.join(',');
			   //console.log(ridsKeys)
			  //请求后台接口
			  this.$http.post(`roles/${this.roleId}/rights`,{rids}).then(res=>{
				  //console.log(res);
				  if(res.data.meta.status!==200) return this.$message.error('角色授权失败！');
				  
				  	this.$message.success('角色授权成功！');	
				  this.RoleVisible = !this.RoleVisible;
				  this.getRoleslist();
				  
			  })
			 
			}
		},
		mounted() {
			this.getRoleslist();
		}
	}
</script>

<style  scoped="scoped">
	.el-row{
		padding: 5px 0;
		display: flex;
		align-items: center;
	}
	.bdtop{
		border-top: 1px solid #ECECEC;
	}
	.bdbottom{
		border-bottom:1px solid #ECECEC ;
	}
	
</style>
