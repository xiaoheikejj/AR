<template>
    <div id="change-definenine">
        <steps :wait="wait" :success="success"></steps>
        <el-row class="boxShadow">
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
                        <el-input v-model.number="ruleForm.activityPrizeCount" placeholder="限制中奖人数" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="兑奖密码" prop="activityPrizePassword">
                        <el-input v-model="ruleForm.activityPrizePassword" placeholder="线下兑奖密码，不超过16个字符" 
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
                            style="width: 49%;"
                            @change="endtimeChange">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="首页背景图">
                        <el-upload
                            drag
                            :list-type="listTypeA"
                            :file-list="fileListA"
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
                            :file-list="fileListB"
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
                            :file-list="fileListC"
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
                            :file-list="fileListD"
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
import { getActivity, editActivity } from '@/api/activity'
export default {
    name: "change-definenine",
    data() {
        //自定义规则的时候必须要添加callback；
        var checkNumOrEng = (rule, value, callback) => {
            let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
            if (reg.test(value)) {
                callback(new Error("中奖密码不能是中文"));
            } else {
                callback();
            }
        }
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            activityID: sessionStorage.getItem("activityID"),
            productID: sessionStorage.getItem("activityProductID"),
            listTypeA: "",
            fileListA: [],
            uploadDisabledA: false,
            listTypeB: "",
            fileListB: [],
            uploadDisabledB: false,
            listTypeC: "",
            fileListC: [],
            uploadDisabledC: false,
            listTypeD: "",
            fileListD: [],
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
                endtime: "",
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
                    {type: 'number', message: '人数必须为数字'},
                ],
                activityPrizePassword: [
                    {required: true,message: "请填写兑奖密码"},
                    {validator: checkNumOrEng},
                ],
                
            },
        }
    },
    components: {
        Steps
    },
    created() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            const params = {
                id: this.activityID,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID
            };
            getActivity(params)
            .then(res => {
                if (res.code === 1) {
                    this.fileListA = [];
                    this.fileListB = [];
                    this.fileListC = [];
                    this.fileListD = [];
                    this.ruleForm.activityName = res.data.activityName;
                    this.ruleForm.activityRuleInfo = res.data.activityRuleInfo;
                    this.ruleForm.activityPrizeInfo = res.data.activityPrizeInfo;
                    this.ruleForm.activityPrizeCount = res.data.activityPrizeCount;
                    this.ruleForm.activityPrizePassword = res.data.activityPrizePassword;
                    this.ruleForm.begintime = res.data.activityBeginTime;
                    this.ruleForm.endtime = res.data.activityEndTime;
                    this.listTypeA = "picture-card";
                    this.uploadDisabledA = true;
                    this.listTypeB = "picture-card";
                    this.uploadDisabledB = true;
                    this.listTypeC = "picture-card";
                    this.uploadDisabledC = true;
                    this.listTypeD = "picture-card";
                    this.uploadDisabledD = true;
                    this.fileListA.push({
                        name: "1",
                        url: res.data.activityImgUrl
                    });
                    this.fileListB.push({
                        name: "2",
                        url: res.data.activityPrizeImgUrl
                    });
                    this.fileListC.push({
                        name: "3",
                        url: res.data.activityBackgroundImgUrl
                    });
                    this.fileListD.push({
                        name: "4",
                        url: res.data.activityInfoAllImgUrl
                    });
                    this.ruleForm.activityImgUrl = res.data.activityImgUrl;
                    this.ruleForm.activityPrizeImgUrl = res.data.activityPrizeImgUrl;
                    this.ruleForm.activityBackgroundImgUrl = res.data.activityBackgroundImgUrl;
                    this.ruleForm.activityInfoAllImgUrl = res.data.activityInfoAllImgUrl;
                    this.ruleForm.smallActivityImgUrl = res.data.smallActivityImgUrl;
                    this.ruleForm.smallActivityPrizeImgUrl = res.data.smallActivityPrizeImgUrl;
                    this.ruleForm.smallActivityBackgroundImgUrl = res.data.smallActivityBackgroundImgUrl;
                    this.ruleForm.smallActivityInfoAllImgUrl = res.data.smallActivityInfoAllImgUrl;
                }
            })
        },
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
                this.ruleForm.activityImgUrl = res.data.fileUrl;
                this.ruleForm.smallActivityImgUrl = res.data.smallFileUrl;
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
                this.ruleForm.activityPrizeImgUrl = res.data.fileUrl;
                this.ruleForm.smallActivityPrizeImgUrl = res.data.smallFileUrl;
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
                this.ruleForm.activityBackgroundImgUrl = res.data.fileUrl;
                this.ruleForm.smallActivityBackgroundImgUrl = res.data.smallFileUrl;
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
                this.ruleForm.activityInfoAllImgUrl = res.data.fileUrl;
                this.ruleForm.smallActivityInfoAllImgUrl = res.data.smallFileUrl;
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
                activityID: this.activityID,
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
                activityImgUrl: this.ruleForm.activityImgUrl,
                activityPrizeImgUrl: this.ruleForm.activityPrizeImgUrl,
                activityBackgroundImgUrl: this.ruleForm.activityBackgroundImgUrl,
                activityInfoAllImgUrl: this.ruleForm.activityInfoAllImgUrl,
                smallActivityImgUrl: this.ruleForm.smallActivityImgUrl,
                smallActivityPrizeImgUrl: this.ruleForm.smallActivityPrizeImgUrl,
                smallActivityBackgroundImgUrl: this.ruleForm.smallActivityBackgroundImgUrl,
                smallActivityInfoAllImgUrl: this.ruleForm.smallActivityInfoAllImgUrl
            };
            //session保存背景图
            sessionStorage.setItem("activityBackgroundImgUrl", this.ruleForm.activityBackgroundImgUrl);
            //session保存背景图
            sessionStorage.setItem("activityInfoAllImgUrl", this.ruleForm.smallActivityInfoAllImgUrl);
            this.$refs[formName].validate(valid => {
                if (valid) {
                    editActivity(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .then(() => {
                        this.$router.push('/deployIdentify');
                    })
                    .catch(() => {
                        this.$message.error("添加失败");
                    })
                }
            })
        },
        /**
         * 改变结束时间时触发
         * @param [value] 返回的结束时间
         */
        endtimeChange(value) {
            if (value) {
                //设置开始时间和结束时间的时间戳
                let begin = new Date(this.ruleForm.begintime).getTime(),
                    end = new Date(value).getTime();
                if (begin > end) {
                    this.$message.warning("请设置合理的时间，结束时间应大于开始时间");
                }
            }
        }
    }
}
</script>

<style lang="scss">
#change-definenine {
    .el-row {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 3px solid #f5f5f5;
    }
}
</style>
