<template>
    <div id="complete-config">
        <steps :wait="wait" :success="success"></steps>
        <p class="title">
            九宫格配置
            <span>图片位置见左图</span>
            <img src="../../assets/img/position.png" alt="" width="60px">
        </p>
        <el-table
            :data="tableData"
            stripe>
            <el-table-column label="图片名">
                <template slot-scope="scope">
                    <span v-if="scope.row.activityInfoID > 0">{{ scope.row.activityImgNo }}号图</span>
                    <span v-else>{{ scope.row.activityInfoName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图片展示">
                <template slot-scope="scope">
                    <img :src="scope.row.activityImgUrl" style="width: 60px;max-height: 60px;">
                </template>
            </el-table-column>
            <el-table-column prop="activityPrizeRatio" label="中奖率">

            </el-table-column>
            <el-table-column label="识别图">
                <template slot-scope="scope">
                    <div @click="cellClickImg(scope.row.activityScanImgUrl)">
                        <img :src="scope.row.activityScanImgUrl" style="width: 60px;max-height: 60px;">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="可识别级别">
                <template slot-scope="scope"
                    v-if="scope.row.activityInfoID > 0">
                    <el-rate
                        v-model="scope.row.activityScanImgGrade"
                        disabled
                        show-text
                        :texts="texts">
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="light" content="修改" placement="top-start"
                        @click.native="configVisible=true;
                        buttonDisabled=false;
                        dialogName = (scope.row.activityImgNo + '号图');
                        transitionValue(scope.row.activityInfoID)"
                        v-if="scope.row.activityInfoID > 0">
                        <icon-svg icon-class="bianji"></icon-svg>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="margin-top: 40px;">
            <el-col :span="6">
                <el-button type="primary" @click="$router.push('/activity')">保存</el-button>
                <!-- <el-button type="info" @click="$router.push('/baseConfig')">上一步</el-button> -->
            </el-col>
        </el-row>
        <!-- 修改九宫格弹窗 -->
        <el-dialog
            :visible.sync="configVisible"
            title="九宫图配置"
            width="500px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="图片名">
                    <el-input v-model="dialogName" disabled></el-input>
                </el-form-item>
                <el-form-item label="展示图">
                    <el-upload
                        drag
                        :list-type="listType"
                        :file-list="fileListA"
                        :class="{disabled: uploadDIS}"
                        :data="ruleForm.uploadImg"
                        :action="url + '/files/upload/'"
                        :on-success="contentsuccess"
                        :on-remove="contentremove"
                        :before-upload="contentbefore">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="识别图">
                    <el-upload
                        :data="ruleForm.uploadImg"
                        :file-list="fileListB"
                        :class="{disabled: uploadDISPLAY}"
                        list-type="picture-card"
                        :action="url + '/files/upload/'"
                        :on-success="identifysuccess"
                        :on-remove="identifyremove"
                        :before-upload="identifybefore">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-rate v-model="ruleForm.grade"
                        disabled
                        show-text
                        :texts="texts">
                    </el-rate>
                </el-form-item>
                <el-form-item label="中奖率" prop="activityPrizeRatio">
                    <el-input placeholder="不能超过100%"
                        v-model.number="ruleForm.activityPrizeRatio" clearable>
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit('ruleForm')" :disabled="buttonDisabled">保存九宫格</el-button>
                    <el-button type="info" @click="configVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            :visible.sync="bigImgVisible"
            title="识别图大图"
            width="500px">
            <img :src="bigImg" width="100%">
        </el-dialog>
    </div>
</template>
<script>
import Steps from '@/components/step/index'
import IconSvg from '@/components/SvgIcon/index'
import { activityIdentifyList, getActivityIdentify, editActivityIdentify } from '@/api/activity'
import { getIdenfityGrade, identifySimilar } from '@/api/identify'
export default {
    name: "activityIdentifyList",
    data() {
        var isInteger = (rule, value, callback) => {
            var val = value%1;
            if (val == 0) {
                callback();
            } else {
                callback(new Error("概率必须为整数"));
            }
        }
        var range = (rule, value, callback) => {
            if (value >= 0 && value <= 100) {
                callback();
            } else {
                callback(new Error("概率必须0-100之间"));
            }
        }
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("activityProductID"),
            listType:"",
            fileListA: [],
            fileListB: [],
            url: process.env.BASE_API,
            dialogName: "",
            uploadDIS: false,
            uploadDISPLAY: false,
            wait: 'wait',
            success: 'success',
            ruleForm: {
                name: "",
                uploadImg: {
                    companyID: sessionStorage.getItem("companyID"),
                    productID: sessionStorage.getItem("activityProductID"),
                    userID: sessionStorage.getItem("companyID"),
                    type: 1,
                    bizID: 1
                },
                identifyUrl: "",
                imageBase64: "",
                grade: 0,
                //中奖概率
                activityPrizeRatio: null,
                activityInfoID: 0,
                activityImgNo: 0,
                activityImgUrl: "",
            },
            rules: {
                activityPrizeRatio: [
                    {required: true, message: "中奖概率不能为空"},
                    {type: 'number', message: '概率需为数字'},
                    {validator: isInteger},
                    {validator: range},
                ]
            },
            tableData: [],
            texts: ["差", "差", "良", "良", "优", "优"],
            configVisible: false,
            bigImgVisible: false,
            bigImg: "",
            buttonDisabled: false
        }
    },
    components: {
        Steps,
        IconSvg
    },
    created() {
        this.getTableData();
    },
    methods: {
        /**图片上传之前 */
        contentbefore(file) {
            const isIMG = file.type.split("/")[0] === 'image';
            if (!isIMG) {
                this.$message.error("只能上传jpg、png图片");
                return false;
            } 
            this.listType = "picture-card";
            this.uploadDIS = true;
        },
        /**去除上传后的图片 */
        contentremove() {
            setTimeout(() => {
                this.listType = "";
                this.uploadDIS = false;
            }, 500);
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        contentsuccess(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.ruleForm.activityImgUrl = res.data.fileUrl;
            }
        },
        /**图片上传之前 */
        identifybefore(file) {
            let fileBase = new FileReader();
            fileBase.readAsDataURL(file);
            fileBase.onload = function(e){
                this.ruleForm.imageBase64 = e.target.result.split('base64,')[1];
            }.bind(this);
            this.uploadDISPLAY = true;
        },
        /**
         * 文件成功时
         * @param [res] 成功后的值
         */
        identifysuccess(res) {
            if (res.code === 1) {
                this.$message.success(res.msg);
                this.ruleForm.identifyUrl = res.data.fileUrl;
                //可以让他上传
                this.buttonDisabled = false;
            }
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                base64Encoding: this.ruleForm.imageBase64
            };
            getIdenfityGrade(params)
            .then(res => {
                if (res.code === 1) {
                    this.ruleForm.grade = res.data;
                    this.$message.success("上传成功");
                }
            })
        },
         /**去除上传后的图片 */
        identifyremove() {
            this.ruleForm.grade = 0;
            this.uploadDISPLAY = false;
            //不能上传
            this.buttonDisabled = true;
        },
        /**获取列表 */
        getTableData() {
            let activityID = sessionStorage.getItem("activityID");
            const params = {
                id: activityID,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID
            };
            activityIdentifyList(params)
            .then(res => {
                if (res.code === 1) {
                    // 统一处理概率
                    res.data.forEach(item => {
                        item.activityPrizeRatio = item.activityPrizeRatio + "%";
                    })
                    this.tableData = res.data;
                    this.tableData.unshift({
                        activityInfoName: "背景图",
                        activityImgUrl: sessionStorage.getItem("activityBackgroundImgUrl")
                    }, {
                        activityInfoName: "完整图",
                        activityImgUrl: sessionStorage.getItem("activityInfoAllImgUrl")
                    })
                }
            })
        },
        /**
         * 获取列表
         * @param [activityInfoID] 识别图列表id
         */
        transitionValue(activityInfoID) {
            this.fileListA = [];
            this.fileListB = [];
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                id: activityInfoID
            };
            getActivityIdentify(params)
            .then(res => {
                if (res.code === 1) {
                    this.ruleForm.activityInfoID = res.data.activityInfoID;
                    this.ruleForm.activityImgNo = res.data.activityImgNo;
                    this.ruleForm.activityImgUrl = res.data.activityImgUrl;
                    this.ruleForm.identifyUrl = res.data.activityScanImgUrl;
                    if (res.data.activityImgUrl !== "") {
                        this.fileListA.push({
                            name: "1",
                            url: res.data.activityImgUrl
                        })
                        this.listType = "picture-card";
                        this.uploadDIS = true;
                    }
                    if(res.data.activityScanImgUrl !== "") {
                        this.fileListB.push({
                            name: "2",
                            url: res.data.activityScanImgUrl
                        })
                        this.uploadDISPLAY = true;
                    }
                    this.ruleForm.grade = res.data.activityScanImgGrade;
                    this.ruleForm.activityPrizeRatio = res.data.activityPrizeRatio;
                }
            })
        },
        submit(formName) {
            let activityID = sessionStorage.getItem("activityID");
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                activityID: activityID,
                activityInfoID: this.ruleForm.activityInfoID,
                activityImgNo: this.ruleForm.activityImgNo,
                activityImgUrl: this.ruleForm.activityImgUrl,
                activityScanImgUrl: this.ruleForm.identifyUrl,
                activityScanImgGrade: this.ruleForm.grade,
                base64Encoding: this.ruleForm.imageBase64,
                activityPrizeRatio: this.ruleForm.activityPrizeRatio
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    new Promise((resolve, reject) => {
                        const data = {
                            companyID: this.companyID,
                            productID: this.productID,
                            userID: this.userID,
                            base64Encoding: this.ruleForm.imageBase64
                        };
                        //如果base64不为空的时候验证base64
                        if (data.base64Encoding != "") {
                            resolve(identifySimilar(data));
                        } else {
                            resolve(1)
                        }
                    })
                    .then(value => {
                        if (value.code === 1 || value == 1) {
                            return Promise.resolve(editActivityIdentify(params));
                        } else {
                            this.$message.error("识别图重复，请更换识别图");
                        }
                    })   
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success('修改成功');
                            this.configVisible = false;
                            this.getTableData();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
        },
        /**点击识别图展示大图 */
        cellClickImg(res) {
            if (res != "") {
                this.bigImg = res;
                this.bigImgVisible = true;
            }
        },
    }
}
</script>

<style lang="scss">
#complete-config {
    .title {
        span {
            font-size: 12px;
            color: rgb(170, 161, 159);
        }
    }
}
</style>