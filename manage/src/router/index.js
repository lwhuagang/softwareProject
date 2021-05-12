import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
	redirect:'/welcome',
    name: 'Home',
    component: ()=> import('../views/Home.vue'),
	children:[
		{
			path:'/welcome',
			name:'welcome',
			component:()=>import('../components/Welcome')
		},
		{
			path:'/users',
			name:'users',
			component:()=>import('../components/user/User')
		},
		{
			path:'/funds',
			name:'funds',
			component:()=>import('../components/fund/funds')
		},
		{
			path:'/unsolvedMsg',
			name:'unsolvedMsg',
			component:()=>import('../components/message/unsolvedMsg')
		},
		{
			path:'/solvedMsg',
			name:'solvedMsg',
			component:()=>import('../components/message/solvedMsg')
		}
		// {
		// 	path:'/rights',
		// 	name:'rights',
		// 	component:()=>import('../components/rights/Rights')
		// },
		// {
		// 	path:'/roles',
		// 	name:'roles',
		// 	component:()=>import('../components/rights/Roles')
		// },
		// {
		// 	path:'/goods',
		// 	name:'goods',
		// 	component:()=>import('../components/goods/Goods')
		// },
		// {
		// 	path:'/params',
		// 	name:'params',
		// 	component:()=>import('../components/goods/Params')
		// },
		// {
		// 	path:'/categories',
		// 	name:'categories',
		// 	component:()=>import('../components/goods/Categories')
		// },
		// {
		// 	path:'/goods/add',
		// 	name:'Add',
		// 	component:()=>import('../components/goods/Add')
		// },
		// {
		// 	path:'/orders',
		// 	name:'Orders',
		// 	component:()=>import('../components/order/Orders')
		// },
	]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to,from,next)=>{
	const token = window.sessionStorage.getItem('token');
	if(to.path!=='/login'){
		if(!token){
			next('/login')
		}else{
			next()
		}
	}else{
		next()
	}

})



export default router
