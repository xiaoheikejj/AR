import Vue from 'vue'
import Router from 'vue-router'


//登录
import Login from '@/views/login/login'
import Layout from '@/views/layout/home'

// 主题库
import ThemeList from '@/views/theme/index'  //index
import NewTheme from '@/views/theme/addTheme' //newTheme
import ModifyTheme from '@/views/theme/modifyTheme'  //修改主题

//识别图
import IdentifyList from '@/views/identify/index' //index
import AddIdentify from '@/views/identify/addIdentify' //add
import ChangeIdentify from '@/views/identify/changeIdentify' //add

// 展示内容
import ContentList from '@/views/content/index' //index
import AddContent from '@/views/content/addContent' //newContent
import ModifyContent from '@/views/content/modifyContent' //newContent

//角色管理
import Role from '@/views/role/index'    //index
import RoleList from '@/views/role/roleList'    //roleList
import AddRole from '@/views/role/addRole'    //addrole
import ChangeRole from '@/views/role/changeRole'    //addrole


// 员工管理
import Staff from '@/views/staff/index'     //index
import AddStaff from '@/views/staff/addStaff'     //addStaff
import ModifyStaff from '@/views/staff/modifyStaff'     //addStaff

// 精彩活动
import Activity from '@/views/activity/index'   //index
import BaseConfig from '@/views/activity/baseConfig'    //基础配置
import DeployIdentify from '@/views/activity/deployIdentify'   //九宫格配置
import ChangeBaseConfig from '@/views/activity/changeBaseConfig'    //修改基本配置
import ChoiceTemplate from '@/views/activity/choiceTemplate' //选择模板

// 统计
import NormalCount from '@/views/count/normalcount'    //普通
import FuCount from '@/views/count/fucount/'    //扫福
import Resouces from '@/views/count/resouces'


// LBS
import LbsList from '@/views/lbs/index'
import AddLbs from '@/views/lbs/addLBS'
import ModifyLbs from '@/views/lbs/modifyLBS'

import LbsArList from '@/views/lbsar/index'
import AddArLbs from '@/views/lbsar/addLBSAr'
import ModifyArLbs from '@/views/lbsar/modifyLBSAr'

import LbsidentifyList from '@/views/lbs/identify/index'
import LbsaddIdentify from '@/views/lbs/identify/addIdentify'
import LbschangeIdentify from '@/views/lbs/identify/changeIdentify'

import LbsAridentifyList from '@/views/lbsar/identify/index'
import LbsAraddIdentify from '@/views/lbsar/identify/addIdentify'
import LbsArchangeIdentify from '@/views/lbsar/identify/changeIdentify'


Vue.use(Router)

const routes = [
    {path: '/', redirect: {name: 'login'}},
    {path: '/login', name: 'login', component: Login},
    {path: '/layout', component: Layout, children: [
        {path: '/', redirect: '/themeList'},
        {path: '/themeList', component: ThemeList},
        {path: '/newTheme', component: NewTheme},
        {path: '/modifyTheme', component: ModifyTheme}, 
        {path: '/identifyList', component: IdentifyList},
        {path: '/addIdentify', component: AddIdentify},
        {path: '/changeIdentify', component: ChangeIdentify},
        {path: '/contentList', component: ContentList},
        {path: '/addContent', component: AddContent},
        {path: '/modifyContent', component: ModifyContent},
        //角色管理
        {path: '/role', component: Role},
        {path: '/roleList', component: RoleList},
        {path: '/addRole', component: AddRole},
        {path: '/changeRole', component: ChangeRole},
        {path: '/staff', component: Staff}, 
        {path: '/addStaff', component: AddStaff},
        {path: '/modifyStaff', component: ModifyStaff},  
        //活动
        {path: '/activity', name: 'activity', component: Activity},
        {path: '/choiceTemplate', name: 'choiceTemplate', component: ChoiceTemplate},
        {path: '/baseConfig', name: 'baseConfig', component: BaseConfig},
        {path: '/deployIdentify', name: 'deployIdentify', component: DeployIdentify},
        {path: '/changeBaseConfig', name: 'changeBaseConfig', component: ChangeBaseConfig},
        //统计
        {path: '/normalCount', name: 'normalCount', component: NormalCount},
        {path: '/fuCount', name: 'fuCount', component: FuCount},
        {path: '/resouces', name: 'resouces', component: Resouces},
        // LBS
        {path: '/lbsList', name: 'lbsList', component: LbsList},
        {path: '/addLbs', name: 'addLbs', component: AddLbs},
        {path: '/modifyLbs', name: 'modifyLbs', component: ModifyLbs},
        {path: '/lbsArList', name: 'lbsArList', component: LbsArList},
        {path: '/addArLbs', name: 'addArLbs', component: AddArLbs},
        {path: '/modifyArLbs', name: 'modifyArLbs', component: ModifyArLbs},
        {path: '/lbsidentifyList', name: 'lbsidentifyList', component: LbsidentifyList},
        {path: '/lbsaddIdentify', name: 'lbsaddIdentify', component: LbsaddIdentify},
        {path: '/lbschangeIdentify', name: 'lbschangeIdentify', component: LbschangeIdentify},
        {path: '/lbsAridentifyList', name: 'lbsAridentifyList', component: LbsAridentifyList},
        {path: '/lbsAraddIdentify', name: 'lbsAraddIdentify', component: LbsAraddIdentify},
        {path: '/lbsArchangeIdentify', name: 'lbsArchangeIdentify', component: LbsArchangeIdentify},
    ]}
]
const router = new Router({
    routes
})
//路由重定向
router.beforeEach((to, from, next) => {
    // if (sessionStorage.getItem("overtime")) {
    //     if (to.path !== "/login" && sessionStorage.getItem("overtime") == -100) {
    //         return next("/login");
    //     }
    // }
    //获取code
    const code = sessionStorage.getItem("code");
    if (to.path !== "/login" && code == -100) {
        return next("/login");
    }
    next()
})



export default router