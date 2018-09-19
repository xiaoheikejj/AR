<template>
    <div id="header">
        <el-header style="text-align: right; line-height: 60px;">
            <span @click="ruleForm2.show=true" class="headerFun changePwd">修改密码</span>
            <span @click="exit" class="headerFun exitLogin">退出</span>
        </el-header>
        <!-- 修改密码弹框 -->
        <el-dialog title="修改密码" 
            :visible.sync="ruleForm2.show"
            width="450px">
            <el-form label-width="100px" :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                <el-form-item label="原密码" prop="old">
                    <el-input v-model="ruleForm2.old" type="password" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new">
                    <el-input v-model="ruleForm2.new" type="password" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirm">
                    <el-input v-model="ruleForm2.confirm" type="password" clearable auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="changePassWord('ruleForm2');ruleForm2.show=false">确定</el-button>
                    <el-button @click="ruleForm2.show=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 退出 -->
    </div>
</template>
<script>
import { changePass, logOut } from '@/api/login'
import sha1 from 'js-sha1'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm2.new != '') {
                    this.$refs.ruleForm2.validateField('old');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请再次输入密码'));
            } else if (value != this.ruleForm2.new) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            ruleForm2: {
                show: false,
                old: '',
                new: '',
                confirm: '' //修改密码
            },
            loginName: '',
            rules2: {
                old: [
                    { required: true, message: '原密码不能为空', trigger: 'blur' }
                ],
                new: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                confirm: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    props: ['logo'],
    methods: {
        /**
         * 改变密码
         * @param formName 需要表单验证的对象
         */
        changePassWord(formName) {
            const params = {
                userID: this.userID,
                companyID: this.companyID,
                oldPassword: sha1.hex(this.ruleForm2.old),
                newPassword: sha1.hex(this.ruleForm2.new)
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    changePass(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            //清除之前保存的session
                            sessionStorage.clear();
                            this.$router.push('/');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message.error("填写错误");
                    return false;
                }
            })
        },
        /*** 退出*/
        exit() {
            this.$confirm('此操作将退出登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error',
            })
            .then(() => {
                //清除之前保存的session
                sessionStorage.clear();
                this.$router.push('/');
                return Promise.resolve(logOut());
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                }
            })         
            .catch(() => {})
        }
    }
}
</script>
<style lang="scss">
html, body, #app {
    height: 100%;
}
#header {
    background-color: #5d8ffc;
    .headerFun {
        color: #fff;
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        padding-left: 27px;
        font-size: 12px;
    }
    .changePwd {
        background: url(../../assets/img/xiugai.png) center left no-repeat/15px auto;
    }
    .exitLogin {
        background: url(../../assets/img/tuichu.png) center left no-repeat/18px auto;
    }
    // .personal {
    //     background: url(../../assets/img/geren.png) center left no-repeat/15px auto;
    // }
}
</style>


