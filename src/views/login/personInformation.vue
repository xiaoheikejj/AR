<template>
    <div id="personInformation">
        <el-container>
            <el-header>
                个人信息
            </el-header>
            <el-main>
                <el-form class="identityInformation" label-width="80px">
                    <el-form-item label="人员编码">{{ userNum }}</el-form-item>
                    <el-form-item label="区域">{{ area }}</el-form-item>
                    <el-form-item label="部门">{{ department }}</el-form-item>
                    <el-form-item label="角色">{{ role }}</el-form-item>
                </el-form>
                <el-form class="baseInformation" v-if="baseShow" label-width="80px">
                    <el-form-item label="姓名">{{ name }}</el-form-item>
                    <el-form-item label="性别">{{ gender }}</el-form-item>
                    <el-form-item label="电话号码">{{ mobile }}</el-form-item>
                    <el-form-item label="邮箱">{{ email }}</el-form-item>
                    <el-form-item label="联系地址">{{ address }}</el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="baseShow=false;modifiableShow=true">修改</el-button>
                    </el-form-item>
                </el-form>
                <el-form class="modifiableInformation" v-if="modifiableShow" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input style="width: 200px;" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="radio" size="mini" @change="changeRadio">
                            <el-radio label="man">男</el-radio>
                            <el-radio label="woman">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input style="width: 200px;" v-model="ruleForm.mobile" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input style="width: 200px;" v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="联系地址">
                        <el-input style="width: 200px;" v-model="ruleForm.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="baseShow=true;modifiableShow=false;modifySubmit()">保存</el-button>
                        <el-button @click="baseShow=true;modifiableShow=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { getPersonal, editPersonal } from '@/api/personal'
export default {
    data() {
        return {
            baseShow: true,
            modifiableShow: false,
            radio : 'man',
            userNum: '',
            area: '',
            department: '',
            role: '',
            name: '',
            gender: '',
            mobile: '',
            email: '',
            address: '',
            ruleForm: {
                name: '',
                mobile: '',
                email: '',
                address: ''
            }
        }
    },
    created() {
        // 验证登录状态
        this.getloginstatus();
        
        this.getInformation();
    },
    methods: {
        getInformation() {
            const data = {
                userID: 1,
                companyID: 1 
            };
            getPersonal(data)
            .then(res => {
                this.userNum = res.extend.info.userNum;
                this.area = res.extend.info.area;
                this.department = res.extend.info.dept;
                this.role = res.extend.info.role;

                this.name = res.extend.info.name;
                this.gender = res.extend.info.gender;
                this.mobile = res.extend.info.mobile;
                this.email = res.extend.info.email;
                this.address = res.extend.info.address;
                
                this.ruleForm.name = res.extend.info.name;
                this.radio = res.extend.info.gender == "男" ? "man" : "woman";
                this.ruleForm.mobile = res.extend.info.mobile;
                this.ruleForm.email = res.extend.info.email;
                this.ruleForm.address = res.extend.info.address;
            })
        },
        changeRadio(val) {
            console.log(val)
        },
        /**
         * 修改
         */
        modifySubmit() {
            const data = {
                employeeName: this.ruleForm.name,
                sex: this.radio == 'man' ? 1 : 2,
                mobile: this.ruleForm.mobile,
                email: this.ruleForm.email,
                employeeAddress: this.ruleForm.address,
                userID: 1,
                companyID: 1 
            };
            editPersonal(data)
            .then(res => {
                if (res.status == 1) {
                    this.getInformation();
                    this.$message({
                        type: 'success',
                        message: res.extend.msg
                    })
                    //控制vuex里面值的变化让
                    //home组件监听后watch出反应
                    
                }
            })
        }
    }
}
</script>
<style lang="less">
#personInformation {
    .identityInformation {
        border-bottom: 1px solid rgba(0,0,0,.3);
    }
    .baseInformation {
        margin-top: 20px;
    }
    .modifiableInformation {
        margin-top: 20px;
    }
}
</style>

