<template>
    <div id="arTheme">
    <el-container>
        <el-header>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>LBS+AR内容管理</el-breadcrumb-item>
                <el-breadcrumb-item class="firstbread">LBS+AR应用库</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main class="boxShadow">
            <el-row type="flex" justify="space-between" class="screenRow">
                <div>
                    <el-select placeholder="全部" 
                        v-model="screen.value" 
                        style="width: 100px;" 
                        @change="isEnabled">
                        <el-option v-for="(item, index) in options" 
                            :key="String(index)" 
                            :label="item.label" 
                            :value="item.value"></el-option>
                    </el-select>
                    <el-input style="width: 400px;" 
                        v-model="searchValue" 
                        placeholder="请输入主题名称" 
                        clearable ></el-input>
                    <el-button type="primary" 
                        icon="el-icon-search" 
                        @click="getTableData(1)">搜索</el-button>
                </div>
                <el-button type="primary" 
                    @click="$router.push('/addArLbs')">新建应用</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table
                stripe
                :data="tableData" 
                style="width: 100%;margin-top: 20px;"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading">
                <el-table-column 
                    type="index" 
                    :index="handleIndex"
                    label="序号" 
                    align="center">            
                </el-table-column>
                <el-table-column label="应用名称" width="80" align="center">
                    <template slot-scope="scope">
                        <span class="spanimg-style" @click="cellClick(scope.row)">
                            <img :src="scope.row.smallThemeImgUrl" style="width: 100%;">
                        </span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class="name-style">{{ scope.row.themeName }}</div>
                        <div style="color: #999;font-size: 12px;">{{ scope.row.themeDescription }}</div>
                        <div style="color: #999;font-size: 12px;">时间： {{ scope.row.themeBeginTime }} - {{ scope.row.themeEndTime }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否在时间范围" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.availableTime==true" style="color:#67C23A">{{ scope.row.available }}</span>
                        <span v-else style="color:#F56C6C">{{ scope.row.available }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="识别图" align="center">
                    <template slot-scope="scope"> 
                        <span @click="enterIdentify(scope.row.themeID)" style="cursor:pointer">
                            {{ scope.row.identifyImgCount }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="开启状态" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="switchopen" 
                            :inactive-value="switchclose"
                            @change="modifySwitch(scope.row.status, scope.row.themeID)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" content="查看" placement="top-start"
                            @click.native="preview(scope.row.themeID)">
                            <icon-svg icon-class="plus-preview"></icon-svg>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="修改" placement="top-start"  
                            @click.native="modifyTheme(scope.row.themeID)">
                            <icon-svg icon-class="bianji"></icon-svg>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="链接" placement="top-start"
                            @click.native="linkUrl(scope.row.themeID)">
                            <icon-svg icon-class="lianjie" ></icon-svg>                            
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="进入识别图" placement="top-start"
                            @click.native="enterIdentify(scope.row.themeID)">
                            <icon-svg icon-class="saomiaoshibie380" style="font-size: 18px;"></icon-svg>                            
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除" placement="top-start" 
                            @click.native="confirmDelete(scope.row.themeID, scope.row.status)">
                            <icon-svg icon-class="shanchu" class="del-icon"></icon-svg>                            
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :page-size="8"
                :current-page="handleCurrent"
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableTotal" 
                background 
                style="text-align:center;margin-top:20px;">
            </el-pagination>
        </el-main>
        <el-footer>
            
        </el-footer>
        <!-- 主题预览 -->
        <el-dialog
            :visible.sync="previewvisible"
            title="预览主题库"
            width="500px">
            <canvas ref="canvas" style="vertical-align: middle;"></canvas>
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
                        <img :src="item" width="100%">
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
            title="获取主题链接"
            width="500px">
            <div class="flex-around">
                <span>URL链接</span>
                <el-input style="width: 300px;"
                    v-model="themeURL"
                    class="urlinput"></el-input>
                <el-button type="primary" 
                    class="copy" 
                    @click="copyURL"
                    data-clipboard-target=".urlinput">复制</el-button>
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
            <img :src="identifyurl" width="100%">
        </el-dialog>
        <el-dialog
            :visible.sync="detailvisible"
            width="500px">
            <img :src="detailurl" width="100%">
        </el-dialog>
    </el-container>
    </div>
</template>
<script>
import { lbsthemeList, deleteTheme, themeStatus, previewTheme, getFinalUrl } from '@/api/theme'
import SXcountup from '@/components/countup/index'
import IconSvg from '@/components/SvgIcon/index'
import QRCode from 'qrcode'
import Swiper from '@/../static/swiper.js'
import Clipboard from 'clipboard'
export default {
    name: 'themeList',
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("lbsArProductID"),
            //筛选
            screen: {
                value: ""
            },
            handleSize: 10,      //每页条数
            handleCurrent: 1,       //页数
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
            tableData: [],
            tableTotal: 0,
            searchValue: '', //搜索的值
            //日历打开后默认当前时间
            switchStatus: 0,  //switch状态
            switchopen: 1,
            switchclose: 0,
            previewvisible: false,
            urlvisible: false,
            themeURL: "",
            slideImgs: [],
            identifyvisible: false,
            identifyurl: "",
            detailvisible: false,
            detailurl: "",
            mySwiper: null,
            loading: true,
            swiperShow: true   //swiper显示和隐藏
      };
    },
    components: {
        SXcountup,
        IconSvg
    },
    created() {
        //如果没有登录跳转到登录页
        if (!this.productID) {
            this.$router.push("/");
        }
        this.getTableData(1);
    },
    methods: {
        /**
         * 获取表单数据
         * @param page 当前第几页
         */
        getTableData(page) {
            this.loading = true;
            const data = {
                pageNo: page,
                pageSize: this.handleSize,
                status: this.screen.value,
                name: this.searchValue,
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID
            };
            lbsthemeList(data)
            .then(res => {
                //消除等待状态
                this.loading = false;
                if (res.code === 1) {
                    res.data.list.forEach(element => {
                        let beginTime = new Date(element.themeBeginTime).getTime(),
                            endTime = new Date(element.themeEndTime).getTime(),
                            nowTime = new Date().getTime();
                        let available,
                            availableTime;
                        if (nowTime > beginTime && nowTime < endTime) {
                            available = "此主题在时间内";
                            availableTime = true;
                        } else {
                            available = "此主题不在时间内";
                            availableTime = false;
                        }
                        element.available = available;
                        element.availableTime = availableTime;
                    });        
                    //把表格的数据和条数放入
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                } else {
                    this.tableData = [];
                    this.tableTotal = 0;
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(1);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(val);
        },
        /**
         * 删除主题前
         * @param id 主题id
         */
        confirmDelete(id, status) {
            const params = {
                id: id,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: -1
            }
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                deleteTheme(params)
                .then(res => {
                    if (res.code === 1) {
                        this.$message.success(res.msg);
                        this.getTableData(this.handleCurrent);
                    }
                })
            })
            .catch(() => {
                this.$message.info('已取消删除');        
            });
        },
        /** * 筛选是否可用*/
        isEnabled() {
            this.handleCurrent = 1;
            this.getTableData(this.handleCurrent);
        },
        /**
         * 该变状态
         * @param [res] 改变后的值 [id] 主题id
         */
        modifySwitch(res, id) {
            const data = {
                id: id,
                status: res,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID
            }
            this.$confirm("此操作将改变开启状态,是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error"
            })
            .then(() => {
                return Promise.resolve(themeStatus(data))
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.getTableData(this.handleCurrent);
                }
            })
            .catch(err => {
                this.$message.info("已经取消修改");
                this.getTableData(this.handleCurrent);
            })
        },
        /**
         * 进入识别图传递的id
         * @param [id] 主题id
         */
        enterIdentify(id) {
            sessionStorage.setItem("themeID", id);
            this.$router.push('/lbsAridentifyList');
        },
        /**
         * 预览
         * @param [themeid] 主题id
         */
        preview(themeid) {
            this.previewvisible = true;
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                id: themeid
            };
            previewTheme(params)
            .then(res => {
                if (res.code === 1) {
                    //判断是否有属性,显示和隐藏swiper
                    if (res.data.hasOwnProperty("contentUrl")) {
                        this.slideImgs = res.data.contentUrl;
                        this.swiperShow = true;
                    } else {
                        this.swiperShow = false;
                    }
                    QRCode.toCanvas(this.$refs.canvas, res.data.codeUrl);        
                    setTimeout(() => {
                        this.mySwiper = new Swiper('.swiper-container', {
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                            slidesPerView: 3,
                            spaceBetween: 20
                        }, 300)   
                    });
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
         * 修改
         * @param [themeid]主题id
         */
        modifyTheme(themeid) {
            sessionStorage.setItem("themeID", themeid);
            this.$router.push("/modifyArLbs");
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
        /**
         * 获取展示链接
         * @param [themeid] 主题id
         */
        linkUrl(themeid) {
            this.urlvisible = true;
            const params = {
                id: themeid,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID
            };
            getFinalUrl(params)
            .then(res => {
                if (res.code === 1) {
                    this.themeURL = res.data;
                    QRCode.toCanvas(this.$refs.canvasB, res.data);
                }
            })
        },
        saveQRCode() {
            const url = this.$refs.canvasB.toDataURL('image/png');
            const downloadLink = $('#downloadLink').attr("href", url).attr("download", "二维码.png");
            downloadLink[0].click();
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
        /**显示大图 */
        cellClick(row) {
            this.detailurl = row.themeImgUrl;
            this.detailvisible = true;
        }
    }
};
</script>
<style lang="scss">
@import url('../../assets/css/swiper.css');
#arTheme {
    .el-table {
        .cell {
            padding-right: 0;
        }
    }
    .swiper-slide {
        max-height: 100px;
        overflow: hidden;
        img {
            height: 100px;
        }
    }
}
</style>