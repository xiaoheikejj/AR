<template>
    <div id="define-nine">
        <steps :wait="wait" :success="success"></steps>
        <el-row>
        <el-col :span="12" :offset="2">
        <el-form 
            :model="ruleForm" 
            :rules="rules" 
            ref="ruleForm" 
            label-width="150px">
            <el-form-item label="活动名称" prop="activityName">
                <el-input v-model="ruleForm.activityName" placeholder="主题活动名称，20个汉字以内"
                    clearable
                    maxlength="20" ></el-input>
            </el-form-item>
            <el-form-item label="活动规则说明" prop="activityRuleInfo">
                <el-input 
                    v-model="ruleForm.activityRuleInfo"
                    type="textarea"
                    placeholder="填写活动规则，100汉字以内"
                    maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="兑奖规则说明" prop="activityPrizeInfo">
                <el-input 
                    v-model="ruleForm.activityPrizeInfo"
                    type="textarea"
                    placeholder="用户兑奖奖品的规则，100汉字以内"
                    maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="中奖人数" prop="activityPrizeCount">
                <el-input v-model="ruleForm.activityPrizeCount" placeholder="限制中奖人数" clearable></el-input>
            </el-form-item>
            <el-form-item label="兑奖密码" prop="activityPrizePassword">
                <el-input v-model="ruleForm.activityPrizePassword" placeholder="线下兑奖密码，不超过16个汉字" 
                    clearable
                    maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    v-model="ruleForm.begintime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="开始日期"
                    style="width: 49%;">
                </el-date-picker>
                <el-date-picker
                    v-model="ruleForm.endtime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束日期"
                    style="width: 49%;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="首页背景图">
                <el-upload
                    drag
                    :list-type="listTypeA"
                    :class="{disabled:uploadDisabledA}"
                    :data="ruleForm.uploadImg"
                    :action="url + '/files/upload/'"
                    :on-success="successUploadA"
                    :on-remove="removeUploadA"
                    :before-upload="beforeUploadA">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="获奖背景图">
                <el-upload
                    drag
                    :list-type="listTypeB"
                    :class="{disabled:uploadDisabledB}"
                    :data="ruleForm.uploadImg"
                    :action="url + '/files/upload/'"
                    :on-success="successUploadB"
                    :on-remove="removeUploadB"
                    :before-upload="beforeUploadB">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="九宫格背景图">
                <el-upload
                    drag
                    :list-type="listTypeC"
                    :class="{disabled:uploadDisabledC}"
                    :data="ruleForm.uploadImg"
                    :action="url + '/files/upload/'"
                    :on-success="successUploadC"
                    :on-remove="removeUploadC"
                    :before-upload="beforeUploadC">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="九宫格完整图">
                <el-upload
                    drag
                    :list-type="listTypeD"
                    :class="{disabled:uploadDisabledD}"
                    :data="ruleForm.uploadImg"
                    :action="url + '/files/upload/'"
                    :on-success="successUploadD"
                    :on-remove="removeUploadD"
                    :before-upload="beforeUploadD">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm')">下一步</el-button>
                <el-button @click="$router.push('/activity')">取消</el-button>
            </el-form-item>
        </el-form>
        </el-col>
        </el-row>
    </div>
</template>
<script>
import Steps from '@/components/step/index'
import { addActivity } from '@/api/activity'
export default {
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("activityProductID"),
            listTypeA: "",
            uploadDisabledA: false,
            listTypeB: "",
            uploadDisabledB: false,
            listTypeC: "",
            uploadDisabledC: false,
            listTypeD: "",
            uploadDisabledD: false,
            url: process.env.BASE_API,
            wait: 'success',
            success: 'wait',
            ruleForm: {
                activityName: '',
                activityRuleInfo: '',
                activityPrizeInfo: '',
                activityPrizeCount: '',
                activityPrizePassword: '',
                begintime: "",
                endtime: '',
                uploadImg: {
                    companyID: sessionStorage.getItem("companyID"),
                    productID: sessionStorage.getItem("activityProductID"),
                    userID: sessionStorage.getItem("userID"),
                    type: 1,
                    bizID: 1
                },
            activityImgUrl: "",
            activityPrizeImgUrl: "",
            activityBackgroundImgUrl: "",
            activityInfoAllImgUrl: "",

            smallActivityImgUrl: "",
            smallActivityPrizeImgUrl: "",
            smallActivityBackgroundImgUrl: "",
            smallActivityInfoAllImgUrl: "",
            },
            rules: {
                activityName: [
                    {required: true,message: "请填写活动名",trigger: "blur"}
                ],
                activityRuleInfo: [
                    {required: true,message: "请填写活动规则说明",trigger: "blur"}
                ],
                activityPrizeInfo: [
                    {required: true,message: "请填写兑奖规则说明",trigger: "blur"}
                ],
                activityPrizeCount: [
                    {required: true,message: "请填写中奖人数",trigger: "blur"}
                ],
                activityPrizePassword: [
                    {required: true,message: "请填写兑奖密码",trigger: "blur"}
                ]
            }
        }
    },
    components: {
        Steps
    },
    created() {
        
    },
    methods: {
        /**图片上传之前 */
        beforeUploadA() {
            this.listTypeA = "picture-card";
            this.uploadDisabledA = true;
        },
        /**去除上传后的图片 */
        removeUploadA() {
            setTimeout(() => {
                this.listTypeA = "";
                this.uploadDisabledA = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUploadA(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.activityImgUrl = res.data.fileUrl;
                this.smallActivityImgUrl = res.data.smallFileUrl;
            }
        },

        /**图片上传之前 */
        beforeUploadB() {
            this.listTypeB = "picture-card";
            this.uploadDisabledB = true;
        },
        /**去除上传后的图片 */
        removeUploadB() {
            setTimeout(() => {
                this.listTypeB = "";
                this.uploadDisabledB = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUploadB(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.activityPrizeImgUrl = res.data.fileUrl;
                this.smallActivityPrizeImgUrl = res.data.smallFileUrl;
            }
        },

        /**图片上传之前 */
        beforeUploadC() {
            this.listTypeC = "picture-card";
            this.uploadDisabledC = true;
        },
        /**去除上传后的图片 */
        removeUploadC() {
            setTimeout(() => {
                this.listTypeC = "";
                this.uploadDisabledC = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUploadC(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.activityBackgroundImgUrl = res.data.fileUrl;
                this.smallActivityBackgroundImgUrl = res.data.smallFileUrl;
                //session保存背景图
                sessionStorage.setItem("activityBackgroundImgUrl", res.data.fileUrl);
            }
        },

        /**图片上传之前 */
        beforeUploadD() {
            this.listTypeD = "picture-card";
            this.uploadDisabledD = true;
        },
        /**去除上传后的图片 */
        removeUploadD() {
            setTimeout(() => {
                this.listTypeD = "";
                this.uploadDisabledD = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        successUploadD(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.activityInfoAllImgUrl = res.data.fileUrl;
                this.smallActivityInfoAllImgUrl = res.data.smallFileUrl;
                //session保存背景图
                sessionStorage.setItem("activityInfoAllImgUrl", res.data.fileUrl);
            }
        },
        /**
         * 提交请求
         * @param [formName] 验证的表单
         */
        submit(formName) {
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: 1,
                activityName: this.ruleForm.activityName,
                activityRuleInfo: this.ruleForm.activityRuleInfo,
                activityPrizeInfo: this.ruleForm.activityPrizeInfo,
                activityPrizeCount: this.ruleForm.activityPrizeCount,
                activityPrizePassword: this.ruleForm.activityPrizePassword,
                activityBeginTime: this.ruleForm.begintime,
                activityEndTime: this.ruleForm.endtime,
                activityImgUrl: this.activityImgUrl,
                activityPrizeImgUrl: this.activityPrizeImgUrl,
                activityBackgroundImgUrl: this.activityBackgroundImgUrl,
                activityInfoAllImgUrl: this.activityInfoAllImgUrl,
                smallActivityImgUrl: this.smallActivityImgUrl,
                smallActivityPrizeImgUrl: this.smallActivityPrizeImgUrl,
                smallActivityBackgroundImgUrl: this.smallActivityBackgroundImgUrl,
                smallActivityInfoAllImgUrl: this.smallActivityInfoAllImgUrl
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addActivity(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            sessionStorage.setItem("activityID", res.data);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .then(() => {
                        this.$router.push('/deployIdentify');
                    })
                    .catch(() => {
                        this.$message.warning("添加失败");
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
#define-nine {
    .el-row {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 3px solid #f5f5f5;
    }
}
</style>
