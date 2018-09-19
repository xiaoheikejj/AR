<template>
    <div id="role">
        <el-header>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>基础配置</el-breadcrumb-item>
                <el-breadcrumb-item class="firstbread">商家信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-row>
        <el-col :span="10" :offset="2">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="企业ID">
                {{ ruleForm.companyNo }}
            </el-form-item>
            <el-form-item label="企业名称">
                {{ ruleForm.companyName }}
                <span style="padding-left: 40px;font-size: 12px;">
                    修改企业名称，请<span style="color: #409EFF;">联系客服</span>
                </span>
            </el-form-item>
            <el-form-item label="常用联系人" prop="companyContact">
                <el-input v-model="ruleForm.companyContact"
                    placeholder="填写联系人名称,20个汉字以内" maxlength="20" clearable :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="companyTel">
                <el-input v-model="ruleForm.companyTel"
                    placeholder="联系电话号码或手机号码" maxlength="11" clearable :disabled="disabled"></el-input>                
            </el-form-item>
            <el-form-item label="电子邮箱" prop="companyEmail">
                <el-input v-model="ruleForm.companyEmail"
                    placeholder="电子邮箱地址，20汉字以内" maxlength="20" clearable :disabled="disabled"></el-input>                                
            </el-form-item>
            <el-form-item label="联系地址" prop="companyAddress">
                <el-input v-model="ruleForm.companyAddress"
                    type="textarea" placeholder="填写公司联系地址，50个汉字以内" maxlength="50" :disabled="disabled"></el-input>                                
            </el-form-item>
            <el-form-item label="邮编号码" prop="companyPostCode">
                <el-input v-model="ruleForm.companyPostCode"
                    placeholder="填写邮编号码" clearable :disabled="disabled"></el-input>                                
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm');">保存</el-button>
                <el-button type="danger" @click="disabled=false">修改</el-button>
            </el-form-item>
        </el-form>
        </el-col>
        </el-row>
    </div>
</template>
<script>
import { getCompanyInfo, editCompanyInfo } from '@/api/role'
export default {
    name: "role",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            ruleForm: {
                companyNo: "",
                companyName: "",
                companyContact: "",
                companyTel: "",
                companyEmail: "",
                companyAddress: "",
                companyPostCode: ""
            },
            rules: {
                companyContact: [
                    {required: true,message: "请输入常用联系人",trigger: "blur"}
                ],
                companyTel: [
                    {required: true,message: "请输入手机号",trigger: "blur"}
                ],
                companyEmail: [
                    {required: true,message: "请输入邮箱",trigger: "blur"}
                ],
                companyAddress: [
                    {required: true,message: "请输入地址",trigger: "blur"}
                ],
                companyPostCode: [
                    {required: true,message: "请输入邮政编码",trigger: "blur"}
                ]
            },
            disabled: true
        }
    },
    created() {
        this.getInfomation();
    },
    methods: {
        /**获取商家信息 */
        getInfomation() {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
            };
            getCompanyInfo(params)
            .then(val => {
                this.ruleForm = val.data;
            })
        },
        /**
         * 保存
         * @param [formName] 表单验证
         */
        submit(formName) {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                companyContact: this.ruleForm.companyContact,
                companyTel: this.ruleForm.companyTel,
                companyEmail: this.ruleForm.companyEmail,
                companyAddress: this.ruleForm.companyAddress,
                companyPostCode: this.ruleForm.companyPostCode
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    editCompanyInfo(params)
                    .then(val => {
                        this.$message.success(val.msg);
                        this.disabled = true;
                    })
                }
            })
        }
    }
}
</script>