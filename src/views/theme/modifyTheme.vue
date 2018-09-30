<template>
    <div id="modify-theme">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>ar内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">修改应用</el-breadcrumb-item>
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
                    :file-list="fileList"
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
                    style="width: 36%;"
                    @change="endtimeChange">
                </el-date-picker>
                <el-button @click="longTime">长期有效</el-button>
            </el-form-item>
            <el-form-item label="主题描述" prop="themeDescription">
                <el-input type="textarea" v-model="ruleForm.themeDescription"
                    placeholder="主题库简要描述，50汉字以内"
                    maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="available">
                <el-switch v-model="ruleForm.available"
                    :active-value="ruleForm.switchopen" 
                    :inactive-value="ruleForm.switchclose"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm');">保存</el-button>
                <el-button @click="$router.push('/themeList')">取消</el-button>
                <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getTheme, editTheme } from '@/api/theme'
import { getCorrectTime } from '@/utils/timeStamp'
export default {
    name: 'modifyTheme',
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("arProductID"),
            listType: "picture-card",
            fileList: [],
            uploadDisabled: true,
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
            },
            themeID: sessionStorage.getItem("themeID")
        }
    },
    created() {
        this.getThemeDetail();
    },
    methods: {
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUpload(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.ruleForm.fileUrl = res.data.fileUrl;
                this.ruleForm.smallFileUrl = res.data.smallFileUrl;
                //上传成功后给予图片预览；后来一直显示不出我也不知道怎么回事
                this.$nextTick(() => {
                    $(".el-upload-list__item-thumbnail").attr("src", res.data.fileUrl);
                })
            }
        },
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
        /**获取列表 */
        getThemeDetail() {
            const params = {
                id: this.themeID,
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID
            };
            this.fileList = [];
            getTheme(params)
            .then(res => {
                this.ruleForm.themeName = res.data.themeName;
                this.ruleForm.themeBegintime = res.data.themeBeginTime;
                this.ruleForm.themeEndtime = res.data.themeEndTime;
                this.ruleForm.themeDescription = res.data.themeDescription;
                this.ruleForm.available = res.data.status;
                this.ruleForm.fileUrl = res.data.themeImgUrl;
                this.ruleForm.smallFileUrl = res.data.smallThemeImgUrl;
                this.fileList.push({
                    name: "1",
                    url: res.data.smallThemeImgUrl
                });
            })
            .then(() => {
                if (this.fileList === []) {
                    this.listType = "";
                    this.uploadDisabled = false;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**保存主题 */
        submit(formName) {
            const params = {
                themeID: this.themeID,
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID,
                themeName: this.ruleForm.themeName,
                themeImgUrl: this.ruleForm.fileUrl,
                smallThemeImgUrl: this.ruleForm.smallFileUrl,
                themeDescription: this.ruleForm.themeDescription,
                themeBeginTime: this.ruleForm.themeBegintime,
                themeEndTime: this.ruleForm.themeEndtime,
                status: this.ruleForm.available
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    editTheme(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push("/themeList");
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
        },
        /**
         * 改变结束时间时触发
         * @param [value] 返回的结束时间
         */
        endtimeChange(value) {
            if (value) {
                //设置开始时间和结束时间的时间戳
                let begin = new Date(this.ruleForm.themeBegintime).getTime(),
                    end = new Date(value).getTime();
                if (begin > end) {
                    this.$message.warning("请设置合理的时间，结束时间应大于开始时间");
                }
            }
        }
    }
}
</script>