<template>
    <el-container id="home">
        <el-aside width="240px">
            <Sidebar :sides="sideLists"></Sidebar>
        </el-aside>
        <el-container direction="vertical">
            <Header :logo="realName"></Header>
            <el-main> 
                <transition :name="transitionName" mode="out-in"> 
                    <router-view></router-view>    
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import Header from './header'
import Sidebar from './sidebar'
export default {
    name: "home",
    data() {
        return {
            transitionName: "fade-transform",
            realName: "",
            sideLists: []
        }
    },
    components: {
        Header,
        Sidebar,
    },
}
</script>
<style lang="scss">
#home {
    height: 100%;
    .el-aside {
        box-shadow: 0 0 10px 5px rgba(235,235,235,0.2);
    }
}
.el-submenu .el-menu-item {
    min-width: 240px;
}
</style>


