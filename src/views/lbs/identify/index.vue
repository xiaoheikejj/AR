<template>
    <div id="identifylist">
        <el-container>
            <el-header>
                <!-- 面包屑 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>LBS内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item>LBS应用库</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">LBS识别图</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main class="boxShadow">
                <!-- 搜索 -->
                <el-row type="flex" justify="space-between" class="screenRow">
                    <div>
                        <el-select placeholder="全部" 
                            v-model="screen.value" 
                            style="width: 100px;" 
                            @change="screenRequst">
                            <el-option v-for="item in options" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"></el-option>
                        </el-select>
                        <el-input style="width: 200px;" 
                            v-model="screen.identifyName" 
                            clearable 
                            placeholder="请输入识别图名称"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="getTableData(1)">搜索</el-button>
                    </div>
                    <el-button type="primary" @click="$router.push('/lbsaddIdentify')">上传识别图</el-button>
                </el-row>
                <!-- 表格 -->
                <el-table 
                    :data="tableData" 
                    style="width: 100%;margin-top: 20px;" 
                    stripe
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
                    <el-table-column label="名称" prop="lbsName" align="center">
                    </el-table-column>
                    <el-table-column label="坐标地址" prop="address" align="center">
                    </el-table-column>
                    <el-table-column label="展示内容" align="center">
                        <template slot-scope="scope">
                            <span class="spanimg-style" @click="cellClickContent(scope.row)">
                                <!-- 图片 -->
                                <img v-if="scope.row.contentType == 1 || scope.row.contentType == 2" 
                                    :src="scope.row.smallContentUrl" width="100%">
                                <!-- 视频 -->
                                <!-- <video v-if="scope.row.contentType == 2" 
                                    :src="scope.row.smallContent" style="width: 100%;"></video> -->
                                <!-- 外链 -->
                                <a v-if="scope.row.contentType == 3" 
                                    :href="scope.row.smallContentUrl" 
                                    target="_blank">
                                </a>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="开启状态" align="center">
                        <template slot-scope="scope">
                            <el-switch 
                                v-model="scope.row.status"
                                @change="slideSwitch(scope.row.lbsID, scope.row.status)"
                                :active-value="switchopen"
                                :inactive-value="switchclose"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" content="修改" placement="top-start"
                                @click.native="changeIdentify(scope.row.lbsID)">
                                <icon-svg icon-class="bianji"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="删除" placement="top-start"
                                @click.native="confirmDelete(scope.row.lbsID, scope.row.status)">
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
                    style="text-align: center;margin-top: 20px;">
                </el-pagination>
            </el-main>
            <el-footer>
                <!-- 分页 -->
                
            </el-footer>
            <!-- 大图 -->
            <el-dialog
                :visible.sync="detailvisible"
                width="500px">
                <img v-if="contentType==1" :src="detailImgUrl" style="width: 100%;">
                <video v-if="contentType==2" ref="video" :src="detailVideoUrl" style="width: 100%;"></video>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
import { delLbs, setLbsStatus, lbsList } from '@/api/identify'
import IconSvg from '@/components/SvgIcon/index'
export default {
    name: "identify",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("lbsProductID"),
            handleSize: 10,      //每页条数
            handleCurrent: 1,       //页数
            // 筛选
            screen: {
                value: "",
                identifyName: "",
                contentName: ""
            },
            modify: {
                show: false
            },
            addRecognitionChart: {
                show: false
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
            tableData: [],
            tableTotal: 0,
            switchopen: 1,
            switchclose: 0,
            texts: ["差", "差", "良", "良", "优", "优"],
            detailvisible: false,
            detailImgUrl: "",
            detailVideoUrl: "",
            contentType: "",
            loading: true
        }
    },
    components: {
        IconSvg
    },
    created() {
        //如果没有登录跳转到登录页
        if (!this.productID) {
            this.$router.push("/");
        }
        this.getTableData(1);
    },
    watch: {
        //点击展示内容的时候播放还是暂停
        detailvisible() {
            this.$nextTick(() => {
                if (this.contentType == 2) {
                    if (this.detailvisible) {
                        this.$refs.video.play();
                    } else {
                        this.$refs.video.pause();
                    }
                }
            })
        }
    },
    methods: {
        /**
         * 获取表格
         * @param [page] 当前第几页
         */
        getTableData(page) {
            this.loading = true;
            let themeID = sessionStorage.getItem("themeID");
            const params = {
                themeID: themeID,
                companyID: this.companyID,
                userID: this.userID,
                productID: this.productID,
                pageNo: this.handleCurrent,
                pageSize: this.handleSize,
                status: this.screen.value,
                name: this.screen.identifyName,
                contentName: this.screen.contentName
            };
            lbsList(params)
            .then(res => {
                this.loading = false;
                if (res.code === 1) {
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                } else {
                    //表格为空，分页不显示
                    this.tableData = [];
                    this.tableTotal = 0;
                }          
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 筛选请求
         */
        screenRequst() {
            this.getTableData(this.handleCurrent);
        },
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(this.handleCurrent);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(val);
        },
        /**
         * 删除前确认
         * @param [id] 识别图id [status] 状态
         */
        confirmDelete(id, status) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                const params = {
                    id: id,
                    status: -1,
                    productID: this.productID,
                    companyID: this.companyID,
                    userID: this.userID
                };
                return Promise.resolve(delLbs(params));
            })
            .then((res) => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.getTableData(this.handleCurrent);
                } 
            })
            .catch(() => {
                this.$message.info('已取消删除');
            });
        },
        /**
         * 修改滑块状态
         * @param [id] 识别图id [status] 状态
         */
        slideSwitch(id, status) {
            this.$confirm("此操作会改变状态,是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error"
            })
            .then(() => {
                const params = {
                    companyID: this.companyID,
                    productID: this.productID,
                    userID: this.userID,
                    id: id,
                    status: status
                };
                return Promise.resolve(setLbsStatus(params));        
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success("修改成功");
                    this.getTableData(this.handleCurrent);
                }
            })
            .catch(err => {
                this.$message.info("已经取消修改");
                this.getTableData(this.handleCurrent);
            })
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
        /**
         * 获取识别图的id
         * @param [id] 识别图的id
         */
        changeIdentify(id) {
            sessionStorage.setItem("identifyID", id);
            this.$router.push("/lbschangeIdentify");
        },
        /**获取大图 */
        cellClickIdentify(row) {
            this.contentType = 1;
            this.detailImgUrl = row.identifyImgUrl;
            this.detailvisible = true;
        },
        /**获取大图 */
        cellClickContent(row) {
            this.contentType = row.contentType;
            this.detailImgUrl = row.contentUrl;
            this.detailVideoUrl = row.contentUrl;
            this.detailvisible = true;
        }
    }
}
</script>