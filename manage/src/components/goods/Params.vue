<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card>
			 <el-alert
			    title="注意,只允许为三级分类添加响应的参数"
			    type="warning"
			    show-icon>
			  </el-alert>
			  <br />
			 <!-- 商品分类的级联选框 -->
		<el-row>
			<el-col align="left" :span="10">
				<span>选择商品分类</span> &nbsp;
			   <el-cascader  v-model="selectedKeys" :options="paramsList" :props="props"
			      @change="changeValue"    ></el-cascader>
		    </el-col>
		</el-row>	
		<br />
	<!-- 标签栏 -->	
	<el-tabs v-model="activeName" @tab-click="handleClick">
		<!-- 添加动态参数面板 -->
	    <el-tab-pane label="动态参数" name="many">
			<el-row>
				<el-col :span="1">
			     <el-button size="mini" type="primary" :disabled="isBtn"  >添加参数</el-button>
			   </el-col>
			</el-row>
			<!-- 动态参数表格 -->
			 <el-table
			    :data="manyData"
			    border
			    style="width: 100%">
				<el-table-column
				  type="expand"
				  width="180">
				</el-table-column>
			    <el-table-column
			      type="index"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="attr_name"
			      label="参数名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="操作">
				  <template slot-scope="scope">
					  <el-button type="primary" icon="el-icon-edit" size="mini"  >编辑</el-button>
					  <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
				  </template>
			    </el-table-column>
			  </el-table>
		</el-tab-pane>
		<!-- 添加静态参数面板 -->
	    <el-tab-pane label="静态参数" name="only" algin="left">
			<el-row>
				<el-col :span="1">
			     <el-button size="mini" type="primary" >添加参数</el-button>
			   </el-col>
			</el-row>
			<!-- 静态参数表格 -->
			 <el-table
			    :data="onlyData"
			    border
			    style="width: 100%">
				<el-table-column
				  type="expand"
				  width="180">
				</el-table-column>
			    <el-table-column
			      type="index"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="attr_name"
			      label="参数名称"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="操作">
				  <template slot-scope="scope">
					  <el-button type="primary" icon="el-icon-edit" size="mini"  >编辑</el-button> &nbsp;
					  <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
				  </template>
			    </el-table-column>
			  </el-table>
		</el-tab-pane>
	   
	  </el-tabs>		
			
			
			
			
		</el-card>
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//当前选中的分类
				selectedKeys:[],
				//分类列表
				paramsList:[],
				
				//配置级联选框的数据如何展示
				props:{
					value:'cat_id',
					label:'cat_name',
					children:'children',
					expandTrigger: 'hover'
				},
				//tab栏激活显示的参数
				activeName:'many',
				//动态属性数据
				manyData:[],
				//静态属性数据
				onlyData:[],
				
				
				
			}
		},
		methods:{
			//获取分类 列表
			getParamsList(){
				this.$http.get('categories').then(res=>{
					console.log(res)
					this.paramsList = res.data.data;
				})
			},
			//当用户选择分类的时候
			changeValue(){
				console.log(this.selectedKeys);
				this.$http.get(`categories/${this.selectedKeys[this.selectedKeys.length-1]}/attributes`,{params: {sel:this.activeName}})
				.then(res=>{
					console.log(res)
					if(this.activeName=='many'){
						this.manyData = res.data.data;
					}else if(this.activeName=='only'){
						this.onlyData = res.data.data;
					}
				})
				
			},
			//当tab栏发生变化的时候
			handleClick(){
				this.changeValue();
			},
			
		},
		created() {
			this.getParamsList();
		},
		computed:{
			//按钮是否被禁用
			isBtn(){
				return this.selectedKeys.length!==3;
			}
		}
	}
</script>

<style scoped="scoped">
	.el-button{
		margin-left: 0;
	}
</style>
