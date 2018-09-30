<template>
    <div id="content-list">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>AR内容管理</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">AR展示内容</el-breadcrumb-item>
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
                        <el-select placeholder="展示内容类型"
                            v-model="screen.contenttype" 
                            style="width: 150px;" 
                            @change="isEnabled"
                            clearable>
                            <el-option v-for="(val, i) in contentType"
                                :key="String(i)" 
                                :label="val.label" 
                                :value="val.value"></el-option>
                        </el-select>
                        <el-input v-model="screen.searchName" 
                            style="width: 200px;" 
                            clearable 
                            placeholder="输入展示内容名称进行搜索"></el-input>
                        <el-button type="primary" 
                            icon="el-icon-search"
                            @click="getTableData(1)">搜索</el-button>
                    </div>
                    <el-button type="primary" @click="$router.push('/addContent')">新建展示内容</el-button>
                </el-row>
                <!-- 表格 -->
                <el-table 
                    :data="tableData"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    style="width: 100%;margin-top: 20px;" 
                    stripe>
                    <el-table-column 
                        type="index" 
                        :index="handleIndex"
                        label="序号" 
                        align="center"
                        width="70px">            
                    </el-table-column>
                    <el-table-column label="展示内容">
                        <template slot-scope="scope">
                            <div style="display: flex;display: -webkit-flex;">
                                <span class="spanimg-style" @click="cellClick(scope.row)">
                                    <img v-if="scope.row.contentType==1 || scope.row.contentType==2" 
                                        :src="scope.row.smallTargetUrl" 
                                        style="width: 100%;">
                                    <!-- <video v-if="scope.row.contentType == 2" 
                                        :src="scope.row.targetUrl"
                                        style="width: 100%;"
                                        preload="metadata"></video> -->
                                    <a v-if="scope.row.contentType==3" 
                                        :href="scope.row.smallTargetUrl"
                                        target="_blank">{{ scope.row.smallTargetUrl }}</a>
                                </span>
                                <div style="margin-left: 10px;">
                                    <div class="name-style" style="margin-top: 10px;">{{ scope.row.contentName }}</div>
                                    <div v-if="scope.row.contentType==1">图片</div>
                                    <div v-if="scope.row.contentType==2">视频</div>
                                    <div v-if="scope.row.contentType==3">外链</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="relationCount" label="已关联图片数" align="center">
                    </el-table-column>
                    <el-table-column label="开启状态" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status"
                                :active-value="switchopen" 
                                :inactive-value="switchclose"
                                @change="contentSwitch(scope.row.contentID, scope.row.status)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" content="修改" placement="top-start" 
                                @click.native="modifyContet(scope.row.contentID)">
                                <icon-svg icon-class="bianji"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="删除" placement="top-start" 
                                @click.native="confirmDelete(scope.row.contentID, scope.row.status)">
                                <icon-svg icon-class="shanchu" style="font-size: 18px;"></icon-svg>                            
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    current-page.sync="1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableTotal"
                    background
                    style="text-align: center;margin-top: 20px;">
                </el-pagination>
            </el-main>
            <el-footer>
                
            </el-footer>
            <!-- 大图 -->
            <el-dialog
                :visible.sync="detailvisible"
                width="500px">
                <img v-show="dialogContentType==1" :src="detailImgUrl" style="width: 100%;">
                <video ref="bigVideo" v-show="dialogContentType==2" autoplay controls :src="detailVideoUrl" style="width: 100%;">
                </video>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
import { contentList, delContent, contentStatus, getDick } from "@/api/content"
import IconSvg from '@/components/SvgIcon/index'
import SXcountup from '@/components/countup/index'
export default {
    name: "contentList",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("arProductID"),
            screen: {
                value: "",
                contenttype: "",
                searchName: "",
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
            switchopen: 1,
            switchclose: 0,
            contentType: [],
            dialogContentType: 0,
            detailvisible: false,
            detailImgUrl: "",
            detailVideoUrl: "",
            loading: true
        }
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
        this.getdick();
    },
    watch: {
        detailvisible() {
            //当video节点渲染进来的时候才开启mp4播放
            this.$nextTick(() => {
                if (this.dialogContentType == 2) {
                    if (this.detailvisible) {
                        this.$refs.bigVideo.play();
                    } else {
                        this.$refs.bigVideo.pause();
                    }
                }
            })
        }
    },
    methods: {
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(1);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(this.handleCurrent);
        },
        /**展示内容类型 */
        getdick() {
            const data = {
                code: "CT"
            };
            getDick(data)
            .then(res => {
                this.contentType = [];
                if (res.code === 1) {
                    res.data.forEach(item => {
                        this.contentType.push({
                            value: item.dicType,
                            label: item.dicName
                        })
                    })
                }
            })
        },
        /**
         * 获取表格数据 
         * @param [page] 当前第几页
         */
        getTableData(page) {
            this.loading = true;
            const data = {
                pageNo: page,
                pageSize: this.handleSize,
                userID: this.userID,
                contentType: this.screen.contenttype,
                productID: this.productID,
                companyID: this.companyID,
                status: this.screen.value,
                name: this.screen.searchName
            }
            contentList(data)
            .then(res => {
                //停止等待
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
         * 删除前确认
         * @param [id] id
         */
        confirmDelete(id, status) {
            const params = {
                id: id,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: -1
            };
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(delContent(params));
            })
            .then(res => {
                this.$message.success(res.msg);
                this.getTableData(this.handleCurrent);
            })
            .catch(() => {
                this.$message.info('已取消删除');   
            });
        },
        /**
         * 修改状态
         * @param [status] 状态 id contentid
         */
        contentSwitch(id, status) {
            const params = {
                id: id,
                productID: this.productID,
                companyID: this.companyID,
                userID: this.userID,
                status: status
            };
            this.$confirm('此操作会改变状态，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(contentStatus(params));
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success("修改成功");
                    this.getTableData(this.handleCurrent);
                }
            })
            .catch(() => {
                this.$message.info('已经取消修改');
                this.getTableData(this.handleCurrent);
            });
        },
        /**
         * 修改展示内容
         * @param [id] contentid
         */
        modifyContet(id) {
            sessionStorage.setItem("contentID", id);
            this.$router.push("/modifyContent");
        },
        /*** 筛选是否可用*/
        isEnabled() {
            this.getTableData(1);
        },
        /**
         * 处理序号
         * @param [res] 返回的序号
         */
        handleIndex(res) {
            //分为1-9
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
        /**点击大图 */
        cellClick(row) {
            // 如果是外链的话下面这些就不执行了
            if (row.contentType == 3) {
                return false;
            }
            this.dialogContentType = row.contentType;
            this.detailImgUrl = row.targetUrl;
            this.detailVideoUrl = row.targetUrl;
            this.detailvisible = true;
        }
    }
}
</script>