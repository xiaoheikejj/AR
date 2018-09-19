<template>
    <div id="login">
        <div class="swiperContainerPar">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in swipers" :key="String(index)">
                        <img :src="item">
                    </div>
                </div>
            </div>
        </div>
        <div class="loginBox">
            <div class="content">
                <p>杭州数行互娱</p>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item prop="companyid" style="position: relative;margin-top: 45px;margin-bottom: 25px;">
                        <icon-svg icon-class="ziliaoneirongguanli_huaban" class="icon-style" style="font-size: 22px;"></icon-svg>
                        <el-input placeholder="请输入企业编号" prefix-icon="xxx" v-model="ruleForm.companyid" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="name" style="position: relative;margin-bottom: 25px;">
                        <icon-svg icon-class="yonghu" class="icon-style"></icon-svg>
                        <el-input placeholder="请输入用户名" prefix-icon="xxx" v-model="ruleForm.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="password" style="position: relative;margin-bottom: 44px;">
                        <icon-svg icon-class="mima" class="icon-style"></icon-svg>
                        <el-input placeholder="请输入密码" prefix-icon="xxx" v-model="ruleForm.password" type="password" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            size="medium" 
                            type="primary" 
                            style="width: 100%;" 
                            v-loading="loading"
                            element-loading-spinner="el-icon-loading"
                            element-loading-text="正在登录中"
                            @click="submitlogin('ruleForm')">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import IconSvg from '@/components/SvgIcon/index'
import Swiper from '@/../static/swiper.js'
import { login, loginPic } from '@/api/login'
import sha1 from 'js-sha1'
export default {
    name: 'login',
    data() {
        return {
            swipers: [],
            ruleForm: {
                companyid: "",
                name: "",   //用户名
                password: ""    //密码
            },
            rules: {
                companyid: [{required: true, message: '请输入企业编号', trigger: 'blur'}],
                name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}],
            },
            loading: false
        }
    },
    components: {
        IconSvg
    },
    created() {
        //清除数据
        sessionStorage.clear();
        this.swipers = [];
    },
    mounted() {
        document.onkeyup = (e) => {
            let event = e || window.event;
            if (event.keyCode == 13) {
                this.submitlogin('ruleForm');
            }
        };
        this.runSwiper();
    },
    methods: {
        async runSwiper() {
            try {
                let first = await this.getImgs();
                let second = await this.run();
            } catch(err) {
                console.log(err);
            }
        },
        run() {
            setTimeout(() => {
                const mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: {
                        autoplay: true,
                    },
                });
            }, 500)  
        },
        /**获取图片 */
        getImgs() {
            loginPic()
            .then(val => {
                if (val.code === 1) {
                    this.swipers = val.data;
                }
            })
        },
        /**
         * 登录
         * @param [formName] 表单验证的对象
         */
        submitlogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = {
                        companyNo: this.ruleForm.companyid,
                        userName: this.ruleForm.name,
                        password: sha1.hex(this.ruleForm.password)
                    };
                    this.loading = true;
                    login(params)
                    .then(res => {
                        this.loading = false;
                        if (res.code === 1) {
                            this.$message.success("登录成功");
                            sessionStorage.setItem("logoUrl", res.data.companyLogoUrl);
                            const arr = JSON.stringify(res.data.resourceList);
                            sessionStorage.setItem("sideBar", arr);
                            sessionStorage.setItem("loginName", res.data.userName);
                            sessionStorage.setItem("companyID", res.data.companyID);
                            sessionStorage.setItem("userID", res.data.userID);
                            sessionStorage.setItem("arProductID", res.data.arProductID);
                            sessionStorage.setItem("activityProductID", res.data.activityProductID);
                            this.$router.push("/themeList");
                        } else {
                            this.$message.error("用户名或密码有误");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message.error('登录信息填写不完整');
                }
            })  
        },
    }
}
</script>
<style lang="scss">
@import url('../../assets/css/swiper.css');
html, body, #app {
    height: 100%;
}
#login {
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    .el-loading-spinner {
        margin-top: -17px;
    }
    .loginBox {
        width: 60%;
        z-index: 3;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        .content {
            width: 400px;
            padding: 50px 25px 60px;
            box-shadow: 0 0 8px 5px rgba(103, 182, 233, .05);
            & > p {
                font-size: 22px;
                color: #529fe5;
                font-family: PingFang SC
            }
            .el-form {
                .el-input__inner {
                    border: 0;
                    border-bottom: 1px solid #dcdfe6;
                }
            }
        }
    }
    .icon-style {
        color: #ccc;
        font-size: 25px;
        position: absolute;
        top: 4px;
        left: 4px;
        z-index: 5;
    }
    .swiperContainerPar {
        width: 40%;
        height:100%;
        display:flex;
        display: -webkit-flex;
        align-items:center;
        background:#4e9ee7;
        .swiper-slide {
           display: flex;
           display: -webkit-flex;
           justify-content: center;
        }
    }
}
</style>





