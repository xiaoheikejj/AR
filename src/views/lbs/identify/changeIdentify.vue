<template>
    <div id="change-identify">
        <el-header>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>LBS内容管理</el-breadcrumb-item>
                <el-breadcrumb-item>LBS应用库</el-breadcrumb-item>
                <el-breadcrumb-item class="firstbread">修改LBS</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-row>
            <el-col :span="10" :offset="2">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="名称" prop="identifyName">
                <el-input v-model="ruleForm.identifyName"
                    placeholder="名称，20个汉字以内"
                    maxlength="20"
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="展示内容">
                <el-upload
                    class="avatar-uploader"
                    disabled
                    :action="'aa'"
                    :data="ruleForm.uploadImg"
                    :show-file-list="false"
                    @click.native="contentdialog=true">
                    <img v-if="ruleForm.smallContentUrl" :src="ruleForm.smallContentUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon i-line-height"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="LBS" style="position: relative;">
                <div id="container" style="width: 100%;height: 300px;"></div>
                <div class="input-card" style='width:300px;position: absolute;bottom: 0;right: 0;margin-right: -400px;'>
                    <label style='color:grey'>根据地址获取经纬度坐标</label>
                    <div class="input-item" style="margin-top:20px;">
                        <el-input id='address' v-model="addressDetail">
                            <template slot="prepend">地址</template>
                        </el-input>
                        （地址仅限中国）
                    </div>
                    <div class="input-item" style="margin-top:20px;">
                        <el-input id='lnglat' disabled v-model="addressNumber">
                            <template slot="prepend">经纬度</template>
                        </el-input>
                    </div>
                    <el-button id="geo" class="btn" type="primary" style="margin-top:20px;">地址 -> 经纬度</el-button>
                </div>
            </el-form-item>
            <el-form-item label="识别图范围" prop="radius">
                <el-input v-model.number="radius">
                    <template slot="append">米</template>
                </el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
                <el-switch 
                    v-model="ruleForm.status"
                    :active-value="ruleForm.switchopen" 
                    :inactive-value="ruleForm.switchclose"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('ruleForm');">保存</el-button>
                <el-button @click="$router.push('/lbsidentifyList')">取消</el-button>
                <el-button type="danger" @click="reset('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
            </el-col>
        </el-row>
        <el-dialog
            title="选择展示内容"
            :visible.sync="contentdialog">
            <!-- 搜索 -->
            <el-row type="flex" justify="space-between" class="screenRow">
                <div>
                    <el-input style="width: 200px;" 
                        v-model="screen.contentName" 
                        clearable 
                        placeholder="请输入展示内容名称"></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="getTableData(1)">搜索</el-button>
                </div>
            </el-row>
            <el-table
                :data="tableData"
                ref="multipleTable"
                highlight-current-row
                @current-change="tableCurrentChange">
                <el-table-column 
                    type="index"
                    :index="handleIndex"
                    width="50px">
                </el-table-column>
                <el-table-column label="展示内容">
                    <template slot-scope="scope">
                        <!-- 图片 -->
                        <img v-if="scope.row.contentType == 1 || scope.row.contentType == 2" 
                            :src="scope.row.smallTargetUrl" width="50px">
                        <!-- 视频 -->
                        <!-- <video v-if="scope.row.contentType == 2" :src="scope.row.targetUrl" style="width: 50px;"></video> -->
                        <!-- 外链 -->
                        <a v-if="scope.row.contentType == 3" :href="scope.row.smallTargetUrl" target="_blank"></a>
                    </template>
                </el-table-column>
                <el-table-column prop="relationCount" label="以关联识别图数">
                    
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange" 
                :page-size="handleSize"
                :current-page="handleCurrent"
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableTotal" 
                background 
                style="text-align: center;">
            </el-pagination>
            <el-row style="margin-top: 20px;">
                <el-col :offset="4">
                    <el-button type="primary" @click="contentdialog=false">确定</el-button>
                    <el-button @click="contentdialog=false">关闭</el-button>
                </el-col>
            </el-row> 
        </el-dialog>
    </div>
</template>
<script>
import { contentList } from "@/api/content"
import { findLbs, editLbs } from '@/api/identify'
export default {
    name: "change-identify",
    data() {
        //输入范围是数字判定
        var isInteger = (rule, value, callback) => {
            if (!Number.isInteger(this.radius)) {
                callback(new Error("范围只能是数字"))
            } else {
                callback();
            }
        }
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("lbsProductID"),
            listType: "",
            uploadDisabled: false,
            ruleForm: {
                url: process.env.BASE_API,
                identifyName: "",
                identifyImgUrl: "",
                smallIdentifyImgUrl: "",
                status: 1,
                switchopen: 1,
                switchclose: 0,
                contentUrl: "", //展示内容url
                contentID: 0,
                grade: 0,
                uploadImg: {
                    productID: sessionStorage.getItem("lbsProductID"),
                    companyID: sessionStorage.getItem("companyID"),
                    userID: sessionStorage.getItem("userID"),
                    type: 1,
                    bizID: 1
                },
            },
            rules: {
                identifyName: [
                    {required: true,message: "请输入识别图名称",trigger: 'blur'}
                ],
                status: [
                    {required: true}
                ],
                radius: [
                    {validator: isInteger}
                ]
            },
            texts: ["差", "差", "良", "良", "优", "优"],
            contentdialog: false,
            tableData: [],
            tableTotal: 0,
            handleSize: 10,
            handleCurrent: 1,
            screen: {
                contentName: ""
            },
            map: null,
            geocoder: null,
            marker: null,
            longitude: 0, //经度
            latitude: 0,  //纬度
            radius: "",  //半径
            addressDetail: "", //地址
            addressNumber: "" //由地址确定的经纬度
        }
    },
    mounted() {
        this.getTableData(1);
        this.getIdentify();
        this.map = new AMap.Map("container", {
            resizeEnable: true
        });
        document.getElementById("geo").onclick = this.geoCode;
        document.getElementById('address').onkeydown = function(e) {
            if (e.keyCode === 13) {
                this.geoCode();
                return false;
            }
            return true;
        }.bind(this); 
        this.map.on("click", function(e) {
            this.longitude = e.lnglat.lng;
            this.latitude = e.lnglat.lat;
            this.addressNumber = this.longitude + "," + this.latitude;
            this.getAddress();
        }.bind(this))  
    },
    methods: {
        /**获取地图信息 */
        geoCode() {
            if(!this.geocoder){
                this.geocoder = new AMap.Geocoder({
                    city: "全国", //城市默认：“全国”
                });
            }
            var address = this.addressDetail;
            this.geocoder.getLocation(address, function(status, result) {
                if (status === 'complete'&&result.geocodes.length) {
                    var lnglat = result.geocodes[0].location;
                    this.longitude = lnglat.lng;    //经度
                    this.latitude = lnglat.lat;     //纬度
                    // console.log(this.longitude, this.latitude);
                    //经度和纬度的确定
                    this.addressNumber = lnglat.lng + "," + lnglat.lat;
                    if(!this.marker){
                        this.marker = new AMap.Marker();
                        this.map.add(this.marker);
                    }
                    this.marker.setPosition(lnglat);
                    this.map.setFitView(this.marker);
                } else {
                    this.$message.error("地址仅限中国");
                }
            }.bind(this));
        },
        /**获取地址 */
        getAddress() {
            if(!this.geocoder){
                this.geocoder = new AMap.Geocoder({
                    city: "全国", //城市默认：“全国”
                });
            }
            if(!this.marker){
                this.marker = new AMap.Marker();
                this.map.add(this.marker);
            }
            const arr = [this.longitude, this.latitude];
            this.marker.setPosition(arr);
            this.geocoder.getAddress(arr, function(status, result) {
                if (status === 'complete'&&result.regeocode) {
                    //实际地址
                    this.addressDetail = result.regeocode.formattedAddress;
                } else {
                    this.$message.error("地址仅限中国");
                }
            }.bind(this));
        },
        /**
         * 图片上传之前图片格式
         * @param [file] 参数为上传的文件
         */
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isIMG = file.type.split("/")[0] === 'image';
            if (!isIMG) {
                this.$message.warning("请上传jpg/png格式的图片");
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false;
            }
            let fileBase = new FileReader();
            fileBase.readAsDataURL(file);
            fileBase.onload = function(e){
                this.ruleForm.imageBase64 = e.target.result.split('base64,')[1];
            }.bind(this);
            this.listType = "picture-card";
            this.uploadDisabled = true;
        },
        /**
         * 上传图片成功后的返回
         * @param [res] 图片成功后传递过来的值
         */
        successUpload(res) {
            const params = {
                productID: this.productID,
                companyID: this.companyID,
                userID: this.userID,
                base64Encoding: this.ruleForm.imageBase64
            };
            if (res.code === 1) {
                this.ruleForm.identifySize = res.data.fileSize;
                this.ruleForm.identifyImgUrl = res.data.fileUrl;
                this.ruleForm.smallIdentifyImgUrl = res.data.smallFileUrl;
                this.$message.success("上传成功");
            }
        },
        /**移除识别图之前 */
        removeUpload() {
            setTimeout(() => {
                this.listType = "";
                this.uploadDisabled = false;
                this.ruleForm.grade = 0;
            }, 500);
        },
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(this.handleCurrent);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(this.handleCurrent);
        },
        /**
         * 请求展示内容
         * @param [page] 当前第几页
         */
        getTableData(page) {
            const params = {
                pageNo: page,
                pageSize: this.handleSize,
                companyID: this.companyID,
                productID: sessionStorage.getItem("arProductID"),
                userID: this.userID,
                name: this.screen.contentName
            };
            contentList(params)
            .then(res => {
                if (res.code === 1) {
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                }       
            })
        },
        /**
         * 选中状态发生变化
         * @param [currentRow] 当前选中栏
         */
        tableCurrentChange(currentRow) {
            this.ruleForm.smallContentUrl = currentRow.smallTargetUrl;
            this.ruleForm.contentID = currentRow.contentID;
        },
        /**获取识别图 */
        getIdentify() {
            let id = sessionStorage.getItem("identifyID");
            const params = {
                productID: this.productID,
                companyID: this.companyID,
                userID: this.userID,
                id: id
            };
            findLbs(params)
            .then(value => {
                this.listType = "picture-card";
                this.uploadDisabled = true;
                this.ruleForm.identifyName = value.data.lbsName;
                this.ruleForm.status = value.data.status;
                // this.ruleForm.contentUrl = value.data.contentUrl;
                this.ruleForm.smallContentUrl = value.data.smallContentUrl;
                this.ruleForm.contentID = value.data.contentID;
                this.addressNumber = value.data.lbsLongitude + "," + value.data.lbsLatitude;
                this.longitude = value.data.lbsLongitude;
                this.latitude = value.data.lbsLatitude;
                // 必须是数字
                this.radius = Number(value.data.radius);
                this.addressDetail = value.data.address;
            })
        },
        /**
         * 提交修改
         * @param formName 需要修改的表单
         */
        submit(formName) {
            let themeID = sessionStorage.getItem("themeID"),
                identifyID = sessionStorage.getItem("identifyID")
            const data = {
                lbsID: identifyID,
                productID: this.productID,
                userID: this.userID,
                companyID: this.companyID,
                themeID: themeID,
                status: this.ruleForm.status,
                lbsName: this.ruleForm.identifyName,
                contentID: this.ruleForm.contentID,
                lbsLongitude: this.longitude,
                lbsLatitude: this.latitude,
                radius: this.radius,
                mapOrder: 1,
                mapName: "amap",
                address: this.addressDetail
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    new Promise((resolve, reject) => {
                        resolve(editLbs(data))
                    })
                    .then(value => {
                        if (value.code === 1) {
                            this.$message.success("修改成功");
                            this.$router.push("/lbsidentifyList");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            })
        },
        /**
         * 处理序号
         * @param [res] 返回的序号
         */
        handleIndex(res) {
            let value = this.handleCurrent - 1 + String(res + 1);
            let arr = value.split("");
            if (arr[0] == 0) {
                arr.shift();
            }
            return arr.join("");
        },
        /**
         * 重置
         * @param [formName] 重置对象
         */
        reset(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style lang="scss">
#change-identify {
    height: 0;
}
.el-table__body tr.current-row>td {
  background: #DCDFE6 !important;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
