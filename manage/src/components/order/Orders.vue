<template>
	<div>
		<!-- 面包屑内容 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		
	   
	   <!-- 主体内容	 -->
	   <el-card>
	   	<!-- 搜索区域 -->
	   	<el-row>
	   		<el-col :span="6">
	   			<el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getOrderList">
	   				<el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
	   			</el-input>
	   		</el-col>
	   		
	   	</el-row>
	   
	   	<!-- 列表用户内容区域	 -->
	   	<el-table :data="orderList" border style="width: 100%">
	   		<el-table-column type="index" width="180">
	   		</el-table-column>
	   		<el-table-column prop="order_number" label="订单编号" width="180">
	   		</el-table-column>
	   		<el-table-column prop="order_price" label="订单价格">
	   		</el-table-column>
	   		<el-table-column prop="pay_status" label="是否付款" width="180">
				<template slot-scope="scope">
					<el-tag type="success" v-if="scope.row.pay_status=='1'">已付款</el-tag>
					<el-tag type="danger" v-else>未付款</el-tag>
				</template>
	   		</el-table-column>
	   		<el-table-column prop="is_send" label="是否发货" width="180">
				<template slot-scope="scope">
					<span>{{scope.row.is_send}}</span>
				</template>
	   		</el-table-column>
	   		<el-table-column prop="create_time" label="下单时间">
	   			<template slot-scope="scope">
					<span>{{ scope.row.create_time| dateFormat()}}</span>	   				
	   			</template>
	   		</el-table-column>
	   		<el-table-column prop="address" label="操作">
	   			<template slot-scope="scope">
	   				<el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEdit"  ></el-button>
	   				<el-button type="warning" icon="el-icon-location" size="mini"></el-button>
	   			</template>
	   		</el-table-column>
	   	</el-table>
	   
	   	<!-- 分页功能 -->
	   	<el-pagination align="left" @size-change="SizeChange" @current-change="CurrentChange" :current-page="queryInfo.pagenum"
	   	 :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
	   	</el-pagination>
	   </el-card>
	   	
	<!-- 修改地址dialog	 -->
	<el-dialog
	  title="修改地址"
	  :visible.sync="EditAddressVisible"
	  width="50%"
	  >
	  <!-- 修改地址主体部分 -->
	  <el-form :model="editAddressForm" :rules="EditFormRul" ref="EditFormRel" label-width="100px" class="demo-ruleForm">
	   
	    <el-form-item label="省市区/县" prop="address1">
	     <el-cascader 
	          v-model="editAddressForm.address1"
	          :options="cityDate"
	         
	         ></el-cascader>
	    </el-form-item>
		<el-form-item label="详细地址" prop="address2">
		  <el-input v-model="editAddressForm.address2"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="EditAddressVisible = false">取 消</el-button>
	    <el-button type="primary" @click="EditAddressVisible = false">确 定</el-button>
	  </span>
	</el-dialog>
		
	<!-- 物流进度对话框 -->
	
	<!-- 修改地址主体部分 -->
	  <el-form :model="editAddressForm" :rules="EditFormRul" ref="EditFormRel" label-width="100px" class="demo-ruleForm">
	   
	    <el-form-item label="省市区/县" prop="address1">
	     <el-cascader 
	          v-model="editAddressForm.address1"
	          :options="cityDate"
	         
	         ></el-cascader>
	    </el-form-item>
		<el-form-item label="详细地址" prop="address2">
		  <el-input v-model="editAddressForm.address2"></el-input>
		</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="EditAddressVisible = false">取 消</el-button>
	    <el-button type="primary" @click="EditAddressVisible = false">确 定</el-button>
	  </span>
	</el-dialog>
	</div>
</template>

<script>
	import cityDate from './citydata.js'
	export default{
		data(){
			return {
				orderList:[],
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10,
					user_id:'',
					pay_status:'',
					is_send:'',
					order_fapiao_title:'',
					order_fapiao_company:'',
					order_fapiao_content:'',
					consignee_addr:''
				},
				total:0,
				//修改地址dialog
				EditAddressVisible:false,
				//修改收货地址的表单
				editAddressForm:{
					address1:[],
					address2:''
				},
				//修改地址栏规则
				EditFormRul:{
					address1:[{ required: true, message: '请选择省市区县', trigger: 'blur' }],
					address2:[{ required: true, message: '请输入详细地址', trigger: 'blur' }]
				},
				//导入的地址
				cityDate:cityDate
			}
		},
		methods:{
			//获取当前订单参数
			getOrderList(){
				this.$http.get('orders',{params:this.queryInfo}).then(res=>{
					console.log(res)
					this.orderList = res.data.data.goods;
					this.total = res.data.data.total;
				})
			},
			//数据条数发生改变时
			SizeChange(newSize){
				this.queryInfo.pagesize = newSize;
				this.getOrderList();
			},
			//当前页码发生改变时
			CurrentChange(newNum){
				this.queryInfo.pagenum = newNum;
				this.getOrderList();
			},
			//点击按钮，弹出dialog
			showEdit(){
				this.EditAddressVisible = !this.EditAddressVisible;
			}
			
		},
		created() {
			this.getOrderList();
		},
		filters:{
			dateFormat(oldate){
				const dd = new Date(oldate);
				const yy = dd.getFullYear();
				const mm = (dd.getMonth()+1+'').padStart(2,0);
				const ri = (dd.getDate()+'').padStart(2,0);
				const ss = (dd.getHours()+'').padStart(2,0);
				const ff = (dd.getMinutes()+'').padStart(2,0);
				const miao = (dd.getSeconds()+'').padStart(2,0);
				
				return `${yy}-${mm}-${ri} ${ss}:${ff}:${miao}`
			}
		}
	}
</script>

<style scoped="scoped">
	.el-cascader{
		width: 100%;
	}
</style>
