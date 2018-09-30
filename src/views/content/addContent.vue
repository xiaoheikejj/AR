<template>
    <div id="add-content">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>AR内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item>AR展示内容</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">创建展示内容</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
        </el-container>
        <el-row>
            <el-col :span="10" :offset="2">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="名称" prop="contentName">
                <el-input v-model="ruleForm.contentName"
                    placeholder="展示内容的名称，20字符以内"
                    maxlength="20"
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="展示内容">
                <el-select v-model="ruleForm.contentType" @change="selectChange">
                    <el-option
                        v-for="(item, index) in options"
                        :key="String(index)"
                        :value="item.value"
                        :label="item.label"></el-option>
                </el-select>
                <span>（上传素材之前选择展示内容）</span>
            </el-form-item>
            <el-form-item label="素材" class="material">
                <el-upload
                    drag
                    :list-type="listType"
                    :class="{disabled:uploadDisabled}"
                    :action="ruleForm.url + '/files/upload'"
                    :data="ruleForm.uploadImg"
                    :on-success="successUpload"
                    :on-remove="removeUpload"
                    :before-upload="beforeUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>不大于20mb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="链接地址">
                <el-input v-model="ruleForm.linkUrl"
                    placeholder="扫描识别图后直接打开的外链地址"
                    @focus="linkChange"></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-switch 
                    v-model="ruleForm.status"
                    :active-value="ruleForm.switchopen" 
                    :inactive-value="ruleForm.switchclose"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm');" :disabled="buttonDisabled">保存</el-button>
                <el-button @click="$router.push('/contentList')">取消</el-button>
                <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { addContent } from '@/api/content'
export default {
    name: "addContent",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("arProductID"),
            listType: "",
            uploadDisabled: false,
            ruleForm: {
                url: process.env.BASE_API,
                contentName: "",
                contentUrl: "",
                smallFileUrl: "",
                status: 1,
                switchopen: 1,
                switchclose: 0,
                contentType: null,
                contentUrl: "",
                imageBase64: "",
                uploadImg: {
                    productID: sessionStorage.getItem("arProductID"),
                    companyID: sessionStorage.getItem("companyID"),
                    userID: sessionStorage.getItem("userID"),
                    type: 1,
                    bizID: 1
                },
                contentSize: 0
            },
            buttonDisabled: true,
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
                status: [
                    {required: true}
                ]
            }
        }
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
                this.$message.warning("上传素材之前请选择展示内容");
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
                    this.$message.warning("请上传mp4格式的视频");
                    return false;
                }
            }
            if (!isLt20M) {
                this.$message.warning('上传头像图片大小不能超过 20MB!');
                return false;
            }
            //选择上传外链的时候
            if (this.ruleForm.contentType == 3) {
                this.$message.warning('当前只能选择上传外链!');
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
                this.$message.success("上传成功");
                //上传成功后给予图片预览；后来一直显示不出我也不知道怎么回事
                this.$nextTick(() => {
                    $(".el-upload-list__item-thumbnail").attr("src", res.data.fileUrl);
                })
                //上传成功后点击保存按钮可以点击
                this.buttonDisabled = false;
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
            //移除图片的时候保存按钮不可点击
            this.buttonDisabled = true;
        },
        /**
         * 新增展示内容
         * @param [formName] 需要新增的表单
         */
        submit(formName) {
            const params = {
                productID: this.productID,
                userID: this.userID,
                companyID: this.companyID,
                contentName: this.ruleForm.contentName,
                contentType: this.ruleForm.contentType,
                smallContentUrl: this.ruleForm.smallFileUrl,
                contentUrl: this.ruleForm.contentUrl,
                linkUrl: this.ruleForm.linkUrl,
                status: this.ruleForm.status,
                contentSize: this.ruleForm.contentSize
            };
            //如果外链不为空，展示内容就是外链
            if (this.ruleForm.contentType && this.ruleForm.linkUrl) {
                params.contentType = 3;
                params.smallContentUrl = this.ruleForm.linkUrl;
                params.contentUrl = this.ruleForm.linkUrl;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addContent(params)
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
        /**改变外链的input框时触发 */
        linkChange() {
            this.buttonDisabled = false;
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
            this.ruleForm.contentType = res;
            this.ruleForm.uploadImg.type = res;
            //如果选中的是外链，把素材库隐藏掉
            if (res == 3) {
                $(".material").fadeOut();
            } else {
                $(".material").fadeIn();
            }
        }
    }
}
</script>
