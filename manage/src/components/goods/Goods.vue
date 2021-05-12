<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		
	<el-card>
		<!-- 搜索区域 -->
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
					<el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
				</el-input>
			</el-col>
			<el-col :span="2">
				<el-button type="primary" @click="addGoods">添加商品</el-button>
			</el-col>
		</el-row>

	     <!-- 列表用户内容区域	 -->
	     <el-table :data="GoodsList" border style="width: 100%">
	     	<el-table-column type="index" width="180">
	     	</el-table-column>
	     	<el-table-column prop="goods_name" label="商品名称" >
	     	</el-table-column>
	     	<el-table-column prop="goods_price" label="商品价格">
	     	</el-table-column>
	     	<el-table-column prop="goods_weight" label="商品重量" >
	     	</el-table-column>
	     	<el-table-column prop="add_time" label="创建时间" >
	     	</el-table-column>
	     	<el-table-column prop="address" label="操作">
	     		<template slot-scope="scope">
	     			<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserlist(scope.row)"></el-button>
	     			<el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
	     			
	     		</template>
	     	</el-table-column>
	     </el-table>	
		
		<!-- 分页功能 -->
		<el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="queryInfo.pagenum"
		 :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</el-card>	
		
		
		
		
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:5
				},
				//商品列表
				GoodsList:[],
				//总的数据条数
				total:0
			}
		},
		methods:{
			getGoodsList(){
				this.$http.get('goods',{params:this.queryInfo})
				.then(res=>{
					//console.log(res);
					this.GoodsList = res.data.data.goods; 
					 this.total = res.data.data.total;
				}) 
			},
			//添加商品
			addGoods(){
				this.$router.push('/goods/add');
			},
			//点击编辑按钮
			editUserlist(){
				
			},
			//点击删除按钮
			removeUser(){
				
			},
			//当页面数据条数发生改变的时候
			SizeChange(newSize){
				this.queryInfo.pagesize = newSize;
				this.getGoodsList();
			},
			//当前页码发生改变的时候触发
			CurrentChange(newPage){
				this.queryInfo.pagenum = newPage;
				this.getGoodsList();
			}
			
			
		},
		created() {
			this.getGoodsList()
		}
	}
</script>

<style scoped="scoped">
</style>
