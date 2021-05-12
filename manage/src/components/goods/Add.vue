<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		
	    <el-card>
		    <el-alert
		      title="添加商品信息"
		      type="info"
		      show-icon  center >
		    </el-alert>	
			
			<!-- 步骤条 -->
			<el-steps :active="active " align-center  finish-status="success" >
			  <el-step title="基本信息" description=""></el-step>
			  <el-step title="商品参数" description=""></el-step>
			  <el-step title="商品属性" description=""></el-step>
			  <el-step title="商品图片" description=""></el-step>
			  <el-step title="商品内容" description=""></el-step>
			  <el-step title="完成"     description=""></el-step>
			</el-steps>
			
			
			
			<!-- tags标签页 -->
			
		
			<el-form :model="queryInfo" :rules="goodsFormRul" ref="goodsFormRel" label-width="100px" class="demo-ruleForm" label-position="top">
				<el-tabs tab-position="left"  v-model="tabVal"  :before-leave="beforeLeave"  @tab-click="tabclick"  >
					<el-tab-pane label="基本信息" name="0"  >
					
					  <el-form-item label="商品名称" prop="goods_name" >
						<el-input v-model="queryInfo.goods_name"></el-input>
					  </el-form-item>
					 <el-form-item label="商品价格" prop="goods_price">
					   <el-input v-model.number="queryInfo.goods_price"></el-input>
					 </el-form-item>
					 <el-form-item label="商品重量" prop="goods_weight">
					   <el-input v-model.number="queryInfo.goods_weight"></el-input>
					 </el-form-item>
					 <el-form-item label="商品数量" prop="goods_number">
					   <el-input v-model.number="queryInfo.goods_number"></el-input>
					 </el-form-item>
					 <el-form-item label="商品分类" prop="goods_cat">
						 <el-cascader
							v-model="queryInfo.goods_cat"
							:options="goodlist"
							:props="props"
							@change="handleChange"></el-cascader>
					 </el-form-item>
					</el-tab-pane>					
				<el-tab-pane label="商品参数" name="1" >
					<el-form-item :label="item.attr_name"  v-for="item in manydata" :key="item.attr_id">
						 <el-checkbox-group v-model="item.attr_vals.split(',')" size="small"  >
						      <el-checkbox :label="item" border  v-for="(item,index) in item.attr_vals.split(',')"  :key="index" ></el-checkbox>
						    </el-checkbox-group>
					</el-form-item> 	
				</el-tab-pane>
				<el-tab-pane label="商品属性" name="2">
					<el-form-item :label="item.attr_name" v-for="item in onlydata" :key="item.attr_id">
					      <el-input v-model="item.attr_vals"></el-input>
					  </el-form-item>
				</el-tab-pane>
				<el-tab-pane label="商品图片" name="3">
					<el-upload
					  class="upload-demo"
					  :action="updateurl"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  list-type="picture"
					  :headers="headerObj"
					  :on-success="handleSuccess"
					  >
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-tab-pane>
				<el-tab-pane label="商品内容" name="4">
					<quill-editor v-model="queryInfo.goods_introduce"></quill-editor>
					
				 <!-- 添加商品按钮 -->
				  <el-button type="primary" @click="btnAdd" algin="left"  >添加商品</el-button>						
				</el-tab-pane>	

		  </el-tabs>	

		</el-form>  	
			
		</el-card>	
		
    <!-- 预览图片对话框 -->	
	<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
	  <img :src="imgPath" class="previewImg" />
	</el-dialog>	
		
	</div>
</template>

<script>
	import _ from 'lodash'
	export default {
		data(){
			return {
				//保存分类数据
			  goodlist:[],
			  //级联选择框配置的属性
			  props:{
				  expandTrigger:'hover',
				  value:'cat_id',
				  label:'cat_name',
				  children:'children'
			  },
			 
			  tabVal:"0",
			  //商品信息参数
			  queryInfo:{
				  //商品名称
				  goods_name:'',
				  //分类列表
				  goods_cat:[],
				  //商品价格
				  goods_price:0,
				  //商品数量
				  goods_number:0,
				  //商品重量
				  goods_weight:0,
				  //商品介绍
				  goods_introduce:'',
				  //上传的图片的临时路径
				  pics:[],
				  attrs:[]
			  },
			  //添加商品校验规则
			  goodsFormRul:{
				  goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
				  goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
				  goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
				  goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
				  goods_cat:[{ required: true, message: '请输入商品分类', trigger: 'blur' }]
			  },
			  //动态参数
			  manydata:[],
			  checkboxGroup1:'',
			  //静态参数
			  onlydata:[],
			  
			  //图片上传
			  //图片上传的地址
			  updateurl:'http://127.0.0.1:8888/api/private/v1/upload',
			  //设置请求头
			  headerObj:{
				  Authorization: window.sessionStorage.getItem('token')
			  },
			  
			  //预览图片对话框
			  previewVisible:false,
			  //预览图片地址
			  imgPath:''
			}
		},
		methods:{
			//级联选择框发生改变的时候触发
			handleChange(){
			  //如果选择的不是三级分类，则此次选择无效
			  if(this.queryInfo.goods_cat.length!==3){
				  this.queryInfo.goods_cat = [];
				  return ;
			  }
			},
			//获取分类参数
			getGoodsList(){
				this.$http.get('categories')
				.then(res=>{
					console.log(res);
					this.goodlist = res.data.data; 
					 
				}) 
			},
			//tab切换的时候，添加校验
			beforeLeave(active,oldactive){
				//console.log(oldactive,newactive);
				if(oldactive==0){
					if(this.queryInfo.goods_cat.length!==3){
						this.$message.error('请选择商品的分类');
						return false;
					}else if(this.queryInfo.goods_name.trim()==''){
						this.$message.error('请输入商品名称');
						return false;
					}else if(this.queryInfo.goods_price==''){
						this.$message.error('请输入商品价格');
						return false;
					}else if(this.queryInfo.goods_weight==''){
						this.$message.error('请输入商品重量');
						return false;
					}else if(this.queryInfo.goods_number==''){
						this.$message.error('请输入商品数量');
						return false;
					}
				}
			},
			//tab点击事件
			tabclick(){
				if(this.active=='1'){
					//发送请求获取动态参数
					this.$http.get(`categories/${this.queryInfo.goods_cat[2]}/attributes`,{params:{sel:'many'}})
					.then(res=>{
						//console.log(res);
						this.manydata = res.data.data;
					})
				}else if(this.active=='2'){
					//发送获取静态属性
					this.$http.get(`categories/${this.queryInfo.goods_cat[2]}/attributes`,{params:{sel:'only'}})
					.then(res=>{
						console.log(res);
						this.onlydata = res.data.data;
					})
				}
			},
			//图片预览
			handlePreview(file){
				//console.log(file)
				this.imgPath = file.response.data.url;
				this.previewVisible = !this.previewVisible;
			},
			//图片删除
			handleRemove(file){
				//console.log(file);
				//获取用户删除图片的临时路径
				const filepath = file.response.data.tmp_path;
				//找到当前文件在临时图片列表中的位置，并删除
				const index = this.queryInfo.pics.findIndex(el=>el.pic==filepath);
				this.queryInfo.pics.splice(index,1);
			},
			//图片上传成功
			handleSuccess(file){
				//console.log(file)
				//上传成功后将后台返回的临时路径，保存到当前的临时路径列表中
				this.queryInfo.pics.push({pic:file.data.tmp_path});
			},
			//添加商品按钮
			btnAdd(){
				const from = _.cloneDeep(this.queryInfo);
				from.goods_cat = from.goods_cat.join(',');
				//处理attrs数组
				 
				this.manydata.forEach(item=>{
					from.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals})
				})
				this.onlydata.forEach(item=>{
					from.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals})
				})
				this.$http.post('goods',from).then(res=>{
					console.log(res);
				})
			}
		},
		computed:{
			active(){
				return  parseInt(this.tabVal); 
			}
			 
		},
		created() {
			this.getGoodsList()
		}
	}
</script>

<style scoped="scoped">
	.el-form-item{
		text-align: left;
	}
</style>
