<template>
    <div id="add-theme">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>ar内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">创建应用</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
        </el-container>
        <el-row>
            <el-col :span="12" :offset="2">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
            <el-form-item label="应用名称" prop="themeName">
                <el-input v-model="ruleForm.themeName"
                    placeholder="主题库名字，20汉字以内"
                    maxlength="20"
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="引导页背景图">
                <el-upload
                    drag
                    :list-type="listType"
                    :class="{disabled:uploadDisabled}"
                    :action="ruleForm.url + '/files/upload'"
                    :data="ruleForm.uploadImg"
                    :before-upload="beforeUpload"
                    :on-success="successUpload"
                    :on-remove="removeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    v-model="ruleForm.themeBegintime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间"
                    style="width: 36%;">
                </el-date-picker>
                <el-date-picker
                    v-model="ruleForm.themeEndtime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间"
                    style="width: 36%;">
                </el-date-picker>
                <el-button @click="longTime">长期有效</el-button>
            </el-form-item>
            <el-form-item label="主题描述" prop="themeDescription">
                <el-input type="textarea" v-model="ruleForm.themeDescription"
                    placeholder="主题库简要描述，50汉字以内"
                    maxlength="50"
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="available">
                <el-switch 
                    v-model="ruleForm.available"
                    :active-value="ruleForm.switchopen" 
                    :inactive-value="ruleForm.switchclose"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addNewTheme('ruleForm');">保存</el-button>
                <el-button @click="$router.push('/themeList')">取消</el-button>
                <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getCorrectTime } from '@/utils/timeStamp'
import { newTheme } from '@/api/theme'
export default {
    name: 'addTheme',
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("arProductID"),
            listType: "",
            uploadDisabled: false,
            ruleForm: {
                url: process.env.BASE_API,
                switchopen: 1,
                switchclose: 0,
                available: 1,   //默认是1
                themeName: '',
                themeBegintime: '',
                themeEndtime: '',
                themeDescription: '',
                uploadImg: {
                    companyID: sessionStorage.getItem("companyID"),
                    userID: sessionStorage.getItem("userID"),
                    productID: sessionStorage.getItem("arProductID"),
                    type: 1,
                    bizID: 1,
                },
                fileUrl: "",
                smallFileUrl: "",
            },
            rules: {
                themeName: [
                    {required: true,message: "请输入主题名称",trigger: 'blur'}
                ],
                themeDescription: [
                    {required: true,message: "请输入主题描述",trigger: 'blur'}
                ],
                available: [
                    {required: true}
                ]
            }
        }
    },
    methods: {
        /**图片上传之前 */
        beforeUpload() {
            this.listType = "picture-card";
            this.uploadDisabled = true;
        },
        /**去除上传后的图片 */
        removeUpload() {
            setTimeout(() => {
                this.listType = "";
                this.uploadDisabled = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUpload(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.ruleForm.fileUrl = res.data.fileUrl;
                this.ruleForm.smallFileUrl = res.data.smallFileUrl;
            }
        },
        /**
         * 保存主题
         * @param [formName] 表单验证
         */
        addNewTheme(formName) {
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                themeName: this.ruleForm.themeName,
                themeImgUrl: this.ruleForm.fileUrl,
                smallThemeImgUrl: this.ruleForm.smallFileUrl,
                themeBeginTime: this.ruleForm.themeBegintime,
                themeEndTime: this.ruleForm.themeEndtime,
                themeDescription: this.ruleForm.themeDescription,
                status: this.ruleForm.available
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    newTheme(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push('/themeList');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            }) 
        },
        /**
         * 重置
         * @param [formName] 重置对象
         */
        reset(formName) {
            this.$refs[formName].resetFields();
        },
        /**长期有效 */
        longTime() {
            this.ruleForm.themeBegintime = getCorrectTime(new Date().getTime());
            this.ruleForm.themeEndtime = getCorrectTime(3153600000000 + new Date().getTime());
        }
    }
}
</script>
