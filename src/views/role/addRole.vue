<template>
    <div id="add-role">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>基础配置</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">创建角色</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main>
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
                    <el-form-item label="角色基础信息配置">
                    </el-form-item>
                    <el-form-item label="角色名" prop="name" style="width: 600px;">
                        <el-input v-model="ruleForm.name"
                            placeholder="填写角色名称,20汉字以内"
                            maxlength="20"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="备注说明" prop="remarks" style="width: 600px;">
                        <el-input type="textarea" v-model="ruleForm.remarks"
                            placeholder="备注说明,50汉字以内"
                            maxlength="50"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label="开启状态" prop="switchstatus">
                        <el-switch
                            v-model="ruleForm.switchstatus"
                            :active-value="ruleForm.switchopen"
                            :inactive-value="ruleForm.switchclose">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="角色权限配置" class="dome-qualificationForm">
                    </el-form-item>
                    <el-form-item>
                        <el-tree
                            show-checkbox
                            ref="tree"
                            empty-text="数据丢失"
                            :data="data3"
                            node-key="id"
                            default-expand-all></el-tree>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                            @click="appendRole('ruleForm')">保存</el-button>
                        <el-button
                            @click="$router.push('/roleList')">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import { getResource, addRole } from '@/api/role'
export default {
    name: "add-role",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            ruleForm: {
                switchstatus: 1,
                switchopen: 1,
                switchclose: 0,
                name: "",
                remarks: "",
            },
            rules: {
                name: [
                    {required: true,message: "请输入角色名",trigger: "blur"}
                ],
                remarks:[
                    {required: true,message: "请输入角色名",trigger: "blur"}                    
                ],
                switchstatus: [
                    {required: true}
                ]
            },
            data3: [],
        }
    },
    created() {
        this.getPower();
    },
    methods: {
        /*** 获取权限*/
        getPower() {
            const params = {
                companyID: this.companyID,
                userID: this.userID
            }
            getResource(params)
            .then(res => {
                this.data3 = res.data;
            })
        },
        /*** 添加角色*/
        appendRole(formName) {
            const checkedKey = this.$refs.tree.getCheckedKeys(),
                halfCheckedKey = this.$refs.tree.getHalfCheckedKeys();
            const resourceIds = [...checkedKey, ...halfCheckedKey];
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                roleName: this.ruleForm.name,
                roleNo: this.ruleForm.remarks,
                status: this.ruleForm.switchstatus,
                resourceIds: resourceIds.join(",")
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addRole(params)
                    .then(val => {
                        if (val.code === 1) {
                            this.$message.success(val.msg);
                            this.$router.push("/roleList");
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
#add-role {
    .dome-qualificationForm {
        border-top: 1px dashed #ccc;
        padding-top: 20px;
    }
}
</style>
