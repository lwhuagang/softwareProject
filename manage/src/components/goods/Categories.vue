<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col :span="1"><el-button type="primary" @click="addCategory">添加分类</el-button></el-col>
			</el-row>
		<br />
		<!-- 树状表格	 -->
		<tree  :data="categoryList" :columns="columns"
		 show-index  index-text="#" border  
		  :selection-type="false"
		   :expand-type="false">
		   
		   <template slot="effect"  slot-scope="scope">
			   <i class="el-icon-success"  v-if="scope.row.cat_deleted===false"    style="color: lightgreen;" ></i>
			    <i class="el-icon-error"  v-else    style="color: red;" ></i>
		   </template>
		   
		   <template slot="order"  slot-scope="scope">
			   <el-tag size="mini" v-if="scope.row.cat_level===0" type="primary"  >一级</el-tag>
			   <el-tag size="mini" v-if="scope.row.cat_level===1" type="success"  >二级</el-tag>
			   <el-tag size="mini" v-if="scope.row.cat_level===2" type="warning"  >三级</el-tag>
		   </template>
		   
		   <template slot="edit"  slot-scope="scope">
			    <el-button size="mini"   type="primary" icon="el-icon-edit" >编辑</el-button>
				 <el-button size="mini"  type="danger" icon="el-icon-delete" >删除</el-button>
			   
		   </template>
		   		   
		   </tree>

		<!-- 分页部分	 -->

       <el-pagination
	     algin="left"
	       background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
			
	</el-card>
		
	<!-- 添加分类dialog -->
	
	<el-dialog
	  title="添加分类"
	  :visible.sync="addCategoriesVisible"
	  width="50%"
	   >
	 <!-- 主体内容区域 -->
	 <el-form :model="categoryForm" :rules="categoryFormRul" ref="categoryFormRef" 
	 label-width="100px"
	  class="demo-ruleForm"
	  @close="closeDialog"
	  >
	   <el-form-item label="分类名称" prop="cat_name">
	     <el-input v-model="categoryForm.cat_name"></el-input>
	   </el-form-item>
	   <el-form-item label="父级分类" prop="cat_pid" >
	       <el-cascader  v-model="selectedKeys" :options="categoryList" :props="props"
	         @change="changeValue"    ></el-cascader>
	   </el-form-item>
	</el-form> 

	  <span slot="footer" class="dialog-footer">
	    <el-button @click="addCategoriesVisible = false">取 消</el-button>
	    <el-button type="primary" @click="addCategoryList">确 定</el-button>
	  </span>
	</el-dialog>

		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//请求分类列表参数
				queryInfo:{
					type:3,
					pagenum:1,
					pagesize:10
				},
				//商品分类列表
				categoryList:[],
				//表格每列的数据
				columns:[
					{label:'分类名称',prop:'cat_name'},
					{label:'是否有效',prop:'', type:'template',template:'effect'},
					{label:'排序',prop:'',type:'template',template:'order'},
					{label:'操作',prop:'',type:'template',template:'edit'}
					
				],
				//总的数据条数
				total:0,
				//控制添加分类dialog显示隐藏
				addCategoriesVisible:false,
			   //添加分类数据
			   categoryForm:{
				   cat_name:'', //分类名称
				   cat_pid:0, //父类id
				   cat_level:0 //分类层级
			   },
			   //用户选中的值
			   selectedKeys:[],
			   //当前的props属性
			   props:{
				   expandTrigger: 'hover',
				   label:'cat_name',
				   value:"cat_id",
				   children:'children'
			   },
			   //添加分类的规则
			   categoryFormRul:{
				   cat_name:[
					    { required: true, message: '请输入活动名称', trigger: 'blur' }
				   ]
			   }
				
			}
		},
		methods:{
			//获取分类数据
			getlist(){
				this.$http.get('categories',{params:this.queryInfo}).then(res=>{
					console.log(res);
					this.categoryList = res.data.data.result;
					//console.log(this.categoryList)
					//保存当前的数据总数
					this.total = res.data.data.total;
				})
			},
			//分页，当每页数据发生改变的时候触发
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize;
				this.getlist();
				
			},
			//分页，当前页码发生改变的时候，触发
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage;
				this.getlist();
			},
			//点击添加分类按钮，弹出添加分类对话框
			addCategory(){
				this.addCategoriesVisible = !this.addCategoriesVisible;
			},
			//当选框发生改变的时候
			changeValue(){
				//console.log(this.selectedKeys)
				if(this.selectedKeys.length>0){
					//把最后一项设置为父类
					this.categoryForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
					//分类等级也要发生改变
					this.categoryForm.cat_level = this.selectedKeys.length;
				}else{
					this.categoryForm.cat_pid=0;
					this.categoryForm.cat_level=0;
				}
			},
			//点击确认按钮，完成添加分类
			addCategoryList(){
				
				this.$refs.categoryFormRef.validate(valid=>{
					if(!valid) return;
					this.$http.post('categories',this.categoryForm).then(res=>{
						//console.log(res);
						if(res.data.meta.status!==201) return this.$message.success('创建失败！');
						this.$message.success('创建成功！');
						this.getlist();
						this.addCategoriesVisible = !this.addCategoriesVisible;
					})
				})
			},
			closeDialog(){
				this.$refs.categoryFormRef.resetFields();
				this.selectedKeys=[];
				this.categoryForm.cat_level=0;
				this.categoryForm.cat_pid=0;
			}
			
		},
		created() {
			this.getlist();
		}
	}
</script>

<style scoped="scoped">
	.el-cascader{
		width: 100%;
	}
</style>
