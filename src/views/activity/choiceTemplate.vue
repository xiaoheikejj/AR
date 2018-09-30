<template>
    <div id="choice-Template">
        <el-container>
            <el-header>
                <el-breadcrumb>
                    <el-breadcrumb-item>精彩活动</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main class="boxShadow">
                <ul class="clearfix">
                    <li>
                        <img :src="imgURL" width="100%" height="100%">
                        <div class="mask">
                            <canvas ref="canvas" style="display:block;margin: 20px auto;"></canvas>
                            <el-button type="primary" @click="$router.push('/baseConfig')">创建活动</el-button>
                        </div>
                    </li>
                </ul>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { getActivityPage } from '@/api/activity'
import QRCode from 'qrcode'
export default {
    data() {
        return{
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("activityProductID"),
            activityID: 1,
            imgURL: ""
        }
    },
    created() {
        this.getData();
    },
    mounted() {

    },
    methods: {
        getData() {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID,
                id: this.activityID
            }
            getActivityPage(params)
            .then(res => {
                if (res.code === 1) {
                    this.imgURL = res.data.imgUrl;
                    QRCode.toCanvas(this.$refs.canvas, res.data.viewUrl);
                }
            })
        }
    }
}
</script>
<style lang="scss">
#choice-Template {
    ul li{
        float: left;
        margin-right: 20px;
        width: 250px;
        height: 330px;
        position: relative;
        .mask {
            text-align: center;
            position: absolute;
            top: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(255,255,255,.6);
            display: none;
        }
        &:hover{
            &>.mask {
                display: block;
            }
        }
    }
}
</style>
