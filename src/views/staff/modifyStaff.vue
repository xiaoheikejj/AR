<template>
    <div id="modify-staff">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>基础配置</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">修改员工</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" 
                    label-width="140px"
                    style="width: 600px;">
                    <el-form-item label="登录账户" prop="account">
                        <el-input v-model="ruleForm.account"
                            placeholder="请填写账号，20汉字以内"
                            maxlength="20"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="员工姓名" prop="name">
                        <el-input v-model="ruleForm.name"
                            placeholder="请填写员工姓名，20汉字以内"
                            maxlength="20"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所属角色" prop="role">
                        <el-select v-model="ruleForm.role">
                            <el-option v-for="(item, index) in roles" :key="String(index)"
                                :value="item.value"
                                :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="ruleForm.phone"
                            placeholder="请填写手机号"
                            maxlength="11"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="开启状态" prop="switchstatus">
                        <el-switch
                            v-model="ruleForm.switchstatus"
                            :active-value="ruleForm.switchopen"
                            :inactive-value="ruleForm.switchclose">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="appendStaff('ruleForm')">保存</el-button>
                        <el-button @click="$router.push('/staff')">取消</el-button>
                        <el-button type="danger" @click="resetPSW">重置密码</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { editStaff, getStaff, reset } from '@/api/staff'
import { roleList } from '@/api/role'
export default {
    name: "modify-staff",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            employeeID: sessionStorage.getItem("employeeID"),
            roles: [],
            ruleForm: {
                account: "",
                name: "",
                role: "",
                phone: "",
                switchstatus: 1,
                switchopen: 1,
                switchclose: 0
            },
            rules: {
                account: [
                    {required: true,message: "请输入账户",trigger: "blur"}
                ],
                name: [
                    {required: true,message: "请输入姓名",trigger: "blur"}
                ],
                role: [
                    {required: true,message: "请输入角色",trigger: "blur"}
                ],
                phone: [
                    {required: true,message: "请输入手机号",trigger: "blur"}
                ],
                switchstatus: [
                    {required: true}
                ]
            },
        }
    },
    mounted() {
        this.getInformation();
        this.findroles();
    },
    methods: {
        /***获取roles*/
        findroles() {
            //添加时首先清空
            this.roles = [];
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                pageNo: 1,
                pageSize: 100,
                status: "",
                name: ""
            };
            roleList(params)
            .then(val => {
                if (val.code === 1) {
                    val.data.list.forEach((item, index) => {
                        this.roles.push({
                            value: item.roleID,
                            label: item.roleName
                        })
                    })
                }
            })
        },
        /** 获取员工信息 */
        getInformation() {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                employeeID: this.employeeID
            };
            getStaff(params)
            .then(res => {
                if (res.code === 1) {
                    this.ruleForm.account = res.data.employeeAccount;
                    this.ruleForm.name = res.data.employeeName,
                    this.ruleForm.phone = res.data.mobile,
                    this.ruleForm.role = res.data.roleName;
                    this.ruleForm.switchstatus = res.data.status
                }
            })
        },
        /* * 新增员工 */
        appendStaff(formName) {
            this.roles.forEach((item) => {
                if (this.ruleForm.role == item.label) {
                    this.ruleForm.role = item.value;
                }
            });
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                employeeID: this.employeeID,
                employeeAccount: this.ruleForm.account,
                employeeName: this.ruleForm.name,
                mobile: this.ruleForm.phone,
                roleID: this.ruleForm.role,
                status: this.ruleForm.switchstatus
            };
            this.$refs[formName].validate(valid =>{
                if (valid) {
                    editStaff(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push("/staff");
                        }
                    })
                }
            })
        },
        resetPSW() {
            this.$confirm('是否重置？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                const params = {
                    employeeID: this.employeeID
                };
                return Promise.resolve(reset(params));
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                }
            })
            .catch(() => {
                this.$message.info("已取消重置");
            })
        }
    }
}
</script>