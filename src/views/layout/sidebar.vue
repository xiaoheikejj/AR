<template>
  <div id="sidebar">
    <div class="logo-area">
        <div>
           <img class="logo" :src="logo">
        </div>
    </div>
    <el-menu background-color="#fff"
        text-color="#303133" 
        active-text-color="#409EFF"
        :default-active="defaultActive"
        unique-opened
        router>
        <!-- 产品和服务 -->
        <el-menu-item disabled index="1" style="text-align: left;padding-left: 20px!important;">
            <span slot="title">
                产品和服务
            </span>
        </el-menu-item>
        <el-submenu v-for="(item, index) in side" :key="'subpro' + String(index)" :index="String(index)">
            <template slot="title">
                <icon-svg :icon-class="item.className"></icon-svg>
                <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
                <el-menu-item v-for='(v, i) in item.child' :key="'itempro' + String(i)" :index="v.target">
                    <span>{{ v.name }}</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import IconSvg from '@/components/SvgIcon/index'
export default {
    name: "sidebar",
    data() {
        return {
            side: [],
            logo: "",
            defaultActive: ""
        }
    },
    components: {
        IconSvg
    },
    created() {
        this.side = JSON.parse(sessionStorage.getItem("sideBar"));
        this.logo = sessionStorage.getItem("logoUrl");
        this.getRoot();
    },
    methods: {
        /** 路由*/
        getRoot() {
            this.defaultActive = location.href.split("#")[1].split("?pid")[0];
        }
    }
};

</script>
<style lang="scss">
#sidebar {
    height: 100%;
    box-shadow: 0px 0px 4px rgba(0,0,0,.5);
    .el-menu {
        border-right: 0;
    }
    .el-menu-item {
        padding-left: 70px !important;
    }
    .logo {
        width: 150px;
    }
    .logo-area {
        height: 60px;
        background-color: #4c83fc;
        & > div {
            height: 100%;
            text-align: center;
            line-height: 60px;
        }
    }
}
</style>
