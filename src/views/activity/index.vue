<template>
    <div id="activity-index">
        <el-container>
            <el-header>
                <el-breadcrumb>
                    <el-breadcrumb-item>精彩活动</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">活动列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main class="boxShadow">
                <!-- 搜索 -->
                <el-row type="flex" justify="space-between" class="screenRow">
                    <div>
                        <el-select placeholder="全部" 
                            v-model="screen.value" 
                            style="width: 100px;" 
                            @change="getTableData(1)">
                            <el-option v-for="item in options" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"></el-option>
                        </el-select>
                        <el-input style="width: 400px;" 
                            v-model="screen.activityName" 
                            clearable 
                            placeholder="请输入活动名称"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="getTableData(1)">搜索</el-button>
                    </div>
                    <el-button type="primary" @click="$router.push('/choiceTemplate')">新建活动</el-button>
                </el-row>
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    style="width: 100%;margin-top: 20px;" 
                    stripe
                    ref="table"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading">
                    <el-table-column 
                        type="index" 
                        :index="handleIndex"
                        label="序号" 
                        align="center"
                        width="70px">            
                    </el-table-column>
                    <el-table-column label="活动名称" class="title-name">
                        <template slot-scope="scope">
                            <div class="name-style">{{ scope.row.activityName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动时间" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.beginTime }} -- {{ scope.row.endTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否在时间范围" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.availableTime==true" style="color:#67C23A">{{ scope.row.available }}</span>
                            <span v-else style="color:#F56C6C">{{ scope.row.available }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动状态" align="center">
                        <template slot-scope="scope">
                            <el-switch 
                                v-model="scope.row.status"
                                @change="slideSwitch(scope.row.activityID, scope.row.status)"
                                :active-value="switchopen"
                                :inactive-value="switchclose"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" content="查看" placement="top-start"
                                @click.native="preview(scope.row.activityID)">
                                <icon-svg icon-class="plus-preview"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="修改" placement="top-start"  
                                @click.native="jumpToActivity(scope.row.activityID)">
                                <icon-svg icon-class="bianji"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="链接" placement="top-start"
                                @click.native="linkUrl(scope.row.activityID)">
                                <icon-svg icon-class="lianjie" ></icon-svg>                            
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="删除" placement="top-start" 
                                @click.native="confirmDelete(scope.row.activityID, scope.row.status)">
                                <icon-svg icon-class="shanchu" class="del-icon"></icon-svg>                            
                            </el-tooltip>
                        </template>
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
                    style="text-align: center;margin-top:20px;">
                </el-pagination>
            </el-main>
            <el-footer>
                <!-- 分页 -->
                
            </el-footer>
        </el-container>
        <!-- 主题预览 -->
        <el-dialog
            :visible.sync="previewvisible"
            title="预览活动"
            width="500px">
            <canvas ref="canvasA" style="vertical-align: middle;"></canvas>
            <span style="vertical-align: middle;" class="dialog-body">
                手机扫左边二维码预览
            </span>
            <div style="width: 460px;border-top: 1px dashed #ccc;padding-top: 20px;">
                <span class="dialog-bottom-title">识别图</span>
                <span class="dialog-bottom-body">点击小图可展示大图</span>
            </div>
            <div class="swiper-container" style="padding-top: 20px;" v-show="swiperShow">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in slideImgs" :key="String(index)">
                        <img :src="item" style="width: 100%;max-height: 100px;">
                    </div>
                </div>
                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </el-dialog>
        <!-- 活动链接 -->
        <el-dialog
            :visible.sync="urlvisible"
            title="获取活动链接"
            width="500px">
            <div class="flex-around">
                <span>URL链接</span>
                <el-input style="width: 300px;"
                    v-model="activityURL"
                    class="urlinput"></el-input>
                <el-button type="primary" 
                    @click="copyURL" 
                    data-clipboard-target=".urlinput"
                    class="copy">复制</el-button>
            </div>
            <div style="display: flex;display: -webkit-flex;">
                <canvas ref="canvasB"></canvas>
                <div style="padding: 15px;">
                    <a id="downloadLink"></a>
                    <div class="linkUrl-style">使用说明</div>
                    <div class="linkUrl-style">1、可将URL链接复制到运营活动入口。</div>
                    <div class="linkUrl-style" style="margin-bottom: 45px;">2、可保存二维码图片，作为用户扫码进入入口</div>
                    <el-button type="primary" @click="saveQRCode">保存二维码</el-button>
                </div>  
            </div>
        </el-dialog>
        <!-- 显示大图 -->
        <el-dialog
            :visible.sync="identifyvisible"
            width="500px">
            <img :src="identifyurl" style="width: 100%;">
        </el-dialog>
    </div>
</template>
<script>
import IconSvg from '@/components/SvgIcon/index'
import { activityList, setActivityStatus, delActivity, previewActivity, getFinalUrl } from '@/api/activity'
import QRCode from 'qrcode'
import Swiper from '@/../static/swiper.js'
import Clipboard from 'clipboard'
export default {
    name: "activity-index",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("activityProductID"),
            handleSize: 10,
            handleCurrent: 1,
            tableTotal: 0,
            tableData: [],
            screen: {
                value: "",
                activityName: ""
            },
            options: [
                {
                    value: "",
                    label: "全部"
                },{
                    value: 0,
                    label: "关闭"
                },{
                    value: 1,
                    label: "开启"
                }
            ],
            switchopen: 1,
            switchclose: 0,
            previewvisible: false,
            slideImgs: [],
            urlvisible: false,
            activityURL: "",
            tooltipdisabled: true,
            //swiper小图点击展示大图
            mySwiper: null,
            identifyvisible: false,
            identifyurl: "",
            loading: true,
            swiperShow: true
        }
    },
    components: {
        IconSvg
    },
    created() {
        //如果没登录跳转到登录页
        if (!this.productID) {
            this.$router.push("/");
        }
        this.getTableData(1);
    },
    methods: {
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(this.handleCurrent);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(val);
        },
        /**
         * 获取活动列表
         * @param [page] 第几页
         */
        getTableData(page) {
            this.loading = true;
            const params = {
                pageNo: page,
                pageSize: this.handleSize,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: this.screen.value,
                name: this.screen.activityName
            };
            activityList(params)
            .then(res => {
                //去除等待动效
                this.loading = false;
                if (res.code === 1) {
                    res.data.list.forEach(element => {
                        let beginTime = new Date(element.beginTime).getTime(),
                            endTime = new Date(element.endTime).getTime(),
                            nowTime = new Date().getTime();
                        let available,
                            availableTime;
                        if (nowTime > beginTime && nowTime < endTime) {
                            available = "此活动在时间内";
                            availableTime = true;
                        } else {
                            available = "此活动不在时间内";
                            availableTime = false;
                        }
                        element.available = available;
                        element.availableTime = availableTime;
                    });    
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                } else {
                    this.tableData = [];
                    this.tableTotal = 0;
                }
            })
        },
        /**
         * 改变状态 改变滑块
         * @param [id] 活动id [status] 值
         */
        slideSwitch(id, status) {
            const params = {
                id: id,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: status
            };
            this.$confirm('此操作将会改变状态，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(setActivityStatus(params))
            })
            .then(value => {
                if (value.code === 1) {
                    this.$message.success(value.msg);
                    this.getTableData(this.handleCurrent);
                } else {
                    this.$message.error(value.msg);
                }
            })
            .catch(() => {
                this.$message.info("已取消修改");
                this.getTableData(this.handleCurrent);
            })
        },
        /**
         * 删除活动
         * @param [id] 活动id
         */
        confirmDelete(id, status) {
            const params = {
                id: id,
                productID: this.productID,
                companyID: this.companyID,
                userID: this.userID,
                status: -1
            };
            this.$confirm('此操作将会删除，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(delActivity(params));
            })
            .then(value => {
                if (value.code === 1) {
                    this.$message.success(value.msg);
                    this.getTableData(this.handleCurrent);
                } else {
                    this.$message.success(value.msg);
                }
            })
            .catch(() => {
                this.$message.info('已取消删除');
            })
        },
        /**
         * 预览
         * @param [activityid] 主题id
         */
        preview(activityid) {
            this.previewvisible = true;
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                id: activityid
            };
            previewActivity(params)
            .then(res => {
                if (res.code === 1) {
                    if (res.data.hasOwnProperty("contentUrl")) {
                        this.slideImgs = res.data.contentUrl;
                        this.swiperShow = true;
                    } else {
                        this.swiperShow = false;
                    }
                    QRCode.toCanvas(this.$refs.canvasA, res.data.codeUrl);
                    setTimeout(() => {
                        this.mySwiper = new Swiper('.swiper-container', {
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                            slidesPerView: 3,
                            spaceBetween: 20
                        })
                    }, 300)        
                    setTimeout(() => {
                        $(".swiper-slide").click(function() {
                            if (this.mySwiper.clickedIndex > 0 || this.mySwiper.clickedIndex==0) {
                                this.identifyurl = this.slideImgs[this.mySwiper.clickedIndex];
                                this.identifyvisible = true;
                            }
                        }.bind(this));
                    }, 500)  
                }
            })
        },
        /**
         * 获取展示链接
         * @param [activityid] 主题id
         */
        linkUrl(activityid) {
            this.urlvisible = true;
            const params = {
                id: activityid,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID
            };
            getFinalUrl(params)
            .then(res => {
                if (res.code === 1) {
                    this.activityURL = res.data;
                    QRCode.toCanvas(this.$refs.canvasB, res.data);
                }
            })
        },
        /*** 打开链接 */
        copyURL() {
            new Clipboard('.copy');
            this.$notify({
                message: '复制成功',
                duration: 2000,
                type: 'success',
                showClose: false,
                position: "top-left"
            });
        },
        saveQRCode() {
            const url = this.$refs.canvasB.toDataURL('image/png');
            const downloadLink = $('#downloadLink').attr("href", url).attr("download", "二维码.png");
            downloadLink[0].click();
        },
        jumpToActivity(activityid) {
            sessionStorage.setItem("activityID", activityid);
            this.$router.push("/changeBaseConfig");
        },
        /**
         * 处理序号
         * @param [res] 返回的序号
         */
        handleIndex(res) {
            let value = this.handleCurrent - 1 + String(res + 1);
            //分为10,20,30
            if (res == 9) {
                value = this.handleCurrent + "0";
            }
            let arr = value.split("");
            if (arr[0] == 0) {
                arr.shift();
            }
            return arr.join("");
        },
    }
}
</script>
<style lang="scss">
@import url('../../assets/css/swiper.css');
.linkUrl-style {
    margin-top: 5px;
}
</style>
