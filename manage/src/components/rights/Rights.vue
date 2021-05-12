<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 主体table -->
	<el-card>	
		<el-table
		    :data="RightsList"
		    border
		    style="width:100%">
		    <el-table-column
		      type="index"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="authName"
		      label="权限名称"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="path"
		      label="路径" >
		    </el-table-column>
			<el-table-column
			  prop="level"
			  label="权限等级"
			  >
			  <template slot-scope="scope">
				  <el-tag type="primary" v-if="scope.row.level==='0'"  >一级</el-tag>
				  <el-tag type="success" v-if="scope.row.level==='1'"   >二级</el-tag>
				  <el-tag type="info"  v-if="scope.row.level==='2'"  >三级</el-tag>
			  </template>
			</el-table-column>
		  </el-table>
		</el-card>
		
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				RightsList:null
			}
		},
		methods:{
			getRightsList(){
				this.$http.get(`rights/list`).then(res=>{
					//console.log(res);
					if(res.data.meta.status!==200) return this.$message.error('请求权限列表失败！');
					this.$message.success('请求权限列表成功！');
					this.RightsList = res.data.data;
				})
			}
		},
		mounted() {
			this.getRightsList();
		}
	}
	 
</script>

<style>
</style>
