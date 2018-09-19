<template>
    <div id="modify-content">
        <el-header>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>AR内容管理</el-breadcrumb-item>
                <el-breadcrumb-item>AR展示内容</el-breadcrumb-item>
                <el-breadcrumb-item class="firstbread">修改展示内容</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-row>
            <el-col :span="10" :offset="2">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
            <el-form-item label="名称" prop="contentName">
                <el-input v-model="ruleForm.contentName"></el-input>
            </el-form-item>
            <el-form-item label="展示内容" @change="selectChange">
                <el-select v-model="ruleForm.contentType">
                    <el-option
                        v-for="(item, index) in options"
                        :key="String(index)"
                        :value="item.value"
                        :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="素材">
                <el-upload
                    drag
                    :list-type="listType"
                    :file-list="fileList"
                    :class="{disabled:uploadDisabled}"
                    :action="ruleForm.url + '/files/upload'"
                    :data="ruleForm.uploadImg"
                    :on-success="successUpload"
                    :on-remove="removeUpload"
                    :before-upload="beforeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
            <el-form-item label="链接地址">
                <el-input v-model="ruleForm.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-switch 
                    v-model="ruleForm.status"
                    :active-value="ruleForm.switchopen" 
                    :inactive-value="ruleForm.switchclose"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm');">保存</el-button>
                <el-button @click="$router.push('/contentList')">取消</el-button>
                <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { getContent, editContent } from "@/api/content"
export default {
    name: "modifyContent",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            contentID: sessionStorage.getItem("contentID"),
            productID: sessionStorage.getItem("arProductID"),
            listType: "",
            uploadDisabled: false,
            fileList: [],
            ruleForm: {
                url: process.env.BASE_API,
                contentName: "",
                contentUrl: "",
                smallFileUrl: "",
                status: 1,
                switchopen: 1,
                switchclose: 0,
                contentType: null,
                linkUrl: "",
                uploadImg: {
                    productID: sessionStorage.getItem("arProductID"),
                    companyID: sessionStorage.getItem("companyID"),
                    userID: sessionStorage.getItem("userID"),
                    type: 1,
                    bizID: 1
                },
                contentSize: 0
            },
            options: [
                {
                    value: 1,
                    label: "图片"
                },{
                    value: 2,
                    label: "视频"
                },{
                    value: 3,
                    label: "外链"
                }
            ],
            rules: {
                contentName: [
                    {required: true,message: "请输入展示内容名称",trigger: 'blur'}
                ],
                // contentType: [
                //     {required: true,message: "还没有选择展示内容"}
                // ],
                // linkUrl: [
                //     {required: true,message: "请输入地址",trigger: 'blur'}
                // ],
                status: [
                    {required: true}
                ]
            }
        }
    },
    created() {
        this.findContent();
    },
    methods: {
        /**
         * 图片上传之前图片格式
         * @param [file] 参数为上传的文件
         */
        beforeUpload(file) {
            let fileBase = new FileReader();
            fileBase.readAsDataURL(file);
            fileBase.onload = function(e){
                this.ruleForm.imageBase64 = e.target.result.split('base64,')[1];
            }.bind(this);
            //如果没有展示内容，不上传图片
            if (!this.ruleForm.contentType) {
                this.$message.error("上传素材之前请选择展示内容");
                return false;
            }
            const isLt20M = file.size / 1024 / 1024 < 20;
            const isIMG = file.type.split("/")[0] === 'image';
            const isMP4 = file.type === 'video/mp4';
            if (this.ruleForm.contentType == 1) {
                if (!isIMG) {
                    this.$message.warning("请上传jpg/png格式的图片");
                    return false;
                }
            } else if (this.ruleForm.contentType == 2) {
                if (!isMP4) {
                    this.$message.warning("请上传mp4格式的图片");
                    return false;
                }
            }
            if (!isLt20M) {
                this.$message.error('上传头像图片大小不能超过 20MB!');
                return false;
            }
            this.listType = "picture-card";
            this.uploadDisabled = true;
        },
        /**上传成功后 */
        successUpload(res) {
            if (res.code === 1) {
                this.ruleForm.contentSize = res.data.fileSize;
                this.ruleForm.contentUrl = res.data.fileUrl;
                this.ruleForm.smallFileUrl = res.data.smallFileUrl;
                this.$message.success(res.msg);
            }
            if (this.ruleForm.contentType === 2) {
                this.$nextTick(() => {
                    $(".el-upload-list__item").find("img").remove();
                    $(".el-upload-list__item").prepend("<video src=" + this.ruleForm.contentUrl + " " + "style='width: 100%;height: 100%;' autoplay></video>")
                })
            } 
        },
        /**移除识别图之前 */
        removeUpload() {
             setTimeout(() => {
                this.listType = "";
                this.uploadDisabled = false;
            }, 500);
        },
        /**得到展示内容 */
        findContent() {
            const params = {
                id: this.contentID,
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID
            };
            getContent(params)
            .then(res => {
                if (res.code === 1) {
                    this.listType = "picture-card";
                    this.uploadDisabled = true;
                    this.fileList = [];
                    if (res.data.contentType === 2) {
                        this.$nextTick(() => {
                            $(".el-upload-list__item").find("img").remove();
                            $(".el-upload-list__item").prepend("<video src=" + this.ruleForm.contentUrl + " " + "style='width: 100%;height: 100%;' autoplay></video>")
                        })
                    } 
                    this.ruleForm.contentName = res.data.contentName;
                    this.ruleForm.linkUrl = res.data.linkUrl;
                    this.ruleForm.status = res.data.status;
                    this.options.forEach((item, index) => {
                        if (res.data.contentType == item.value) {
                            this.ruleForm.contentType = item.label;
                        }
                    });
                    this.fileList.push({
                        name: "1",
                        url: res.data.targetUrl
                    });
                    this.ruleForm.contentUrl = res.data.targetUrl;
                    this.ruleForm.contentSize = res.data.contentSize;
                    this.ruleForm.contentType = res.data.contentType;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 提交
         * @param [formName] 需要修改的表单
         */
        submit(formName) {
            const params = {
                id: sessionStorage.getItem("contentID"),
                productID: this.productID,
                userID: this.userID,
                companyID: this.companyID,
                contentName: this.ruleForm.contentName,
                contentType: this.ruleForm.contentType,
                smallContentUrl: this.ruleForm.smallFileUrl,
                contentUrl: this.ruleForm.contentUrl,
                linkUrl: this.ruleForm.linkUrl,
                status: this.ruleForm.status,
                contentSize: this.ruleForm.contentSize,
            };
            this.$refs[formName].validate(valid => {
                if (valid) {
                    editContent(params)
                    .then(res => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.$router.push("/contentList");
                        } else {
                            this.$message.error(res.msg);
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
        /**改变select */
        selectChange(res) {
            this.ruleForm.uploadImg.type = res;
        }
    }
}
</script>