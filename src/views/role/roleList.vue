<template>
    <div id="recognition-chart">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>基础配置</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">角色管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main>
                <el-row type="flex" justify="space-between" class="screenRow">
                    <div>
                        <el-select placeholder="全部" 
                            v-model="screen.value" 
                            style="width: 100px;" 
                            @change="isEnabled">
                            <el-option v-for="item in options" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"></el-option>
                        </el-select>
                        <el-input style="width: 400px;" 
                            v-model="screen.roleName" 
                            clearable 
                            placeholder="请输入角色名"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="getTableData(1)">搜索</el-button>
                    </div>
                    <el-button type="primary" @click="$router.push('/addRole')">新建角色</el-button>
                </el-row>
                <!-- 表格 -->
                <el-table 
                    :data="tableData" 
                    style="width: 100%;margin-top: 20px;" 
                    stripe
                    v-loading="loading"
                    element-loading-text="拼命加载中">
                    <el-table-column 
                        type="index" 
                        :index="handleIndex"
                        label="序号" 
                        align="center">            
                    </el-table-column>
                    <el-table-column label="角色名" align="center">
                        <template slot-scope="scope">
                            <div class="title-name">{{scope.row.roleName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="已分配人数" prop="userNo" align="center">

                    </el-table-column>
                    <el-table-column label="修改时间" prop="gmtModified" align="center">

                    </el-table-column>
                    <el-table-column label="开启状态" align="center">
                        <template slot-scope="scope">
                            <el-switch 
                                v-model="scope.row.status"
                                @change="slideSwitch(scope.row.roleID, scope.row.status)"
                                :active-value="switchOpen"
                                :inactive-value="switchClose"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="light" content="修改" placement="top-start" 
                                @click.native="changeRole(scope.row.roleID)">
                                <icon-svg icon-class="bianji" v-if="scope.row.roleID > 1"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="删除" placement="top-start" 
                                @click.native="confirmDelete(scope.row.roleID)">
                                <icon-svg icon-class="shanchu" style="font-size: 18px;" v-if="scope.row.roleID > 1"></icon-svg>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
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
            </el-footer>
        </el-container>
    </div>
</template>
<script>
import { roleList, roleStatus, delRole } from '@/api/role'
import IconSvg from '@/components/SvgIcon/index'
export default {
    name: "role-list",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            handleSize: 10,      //每页条数
            handleCurrent: 1,       //页数
            screen: {
                value: "",
                roleName: ""
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

            modifyDisabled: true,
            addDisabled: true,
            loading: false,
            switchOpen: 1,
            switchClose: 0
        }
    },
    components: {
        IconSvg
    },
    created() {
        this.getTableData(1);
    },
    methods: {
        /**
         * 获取表格
         * @param [page] 当前第几页
         */
        getTableData(page) {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                pageNo: page,
                pageSize: this.handleSize,
                status: this.screen.value,
                name: this.screen.roleName
            };
            roleList(params)
            .then(res => {
                if (res.code === 1) {
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                    this.loading = false;
                } else {
                    //表格为空，分页不显示
                    this.tableData = [];
                }          
            })
            .catch(err => {
                console.log(err);
            })
        },
        /*** 筛选是可用还是不可用*/
        isEnabled() {
            this.handleCurrent = 1;
            this.getTableData(this.handleCurrent);
        },
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.loading = true;
            this.getTableData(this.handleCurrent);
        },
        handleSizeChange(val) {
            this.handleSize = val;
            this.loading = true;
            this.getTableData(1);
        },
        /**
         * 删除前确认
         * @param id 角色id
         */
        confirmDelete(id) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                this.deleteRole(id);
            })
            .catch(() => {
                this.$message.info('已取消删除');          
            });
        },
        /**
         * 删除当前角色
         * @param id 识别图id
         */
        deleteRole(id) {
            const data = {
                companyID: this.companyID,
                userID: this.userID,
                status: -1,
                id: id
            };
            delRole(data)
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.getTableData(this.handleCurrent);
                } else {
                    this.$message.error(res.msg);
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 修改滑块状态
         * @param [id] 角色状态 [status] 状态
         */
        slideSwitch(id, status) {
            const data = {
                id: id,
                status: status,
                companyID: this.companyID,
                userID: this.userID
            };
            this.$confirm('此操作将改变状态, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(roleStatus(data));
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.getTableData(this.handleCurrent);
                } else {
                    this.$message.error(res.msg);
                }
            })
            .catch(err => {
                this.$message.info("已取消修改");
                this.getTableData(this.handleCurrent);
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
        /**跳转改变链接 */
        changeRole(roleid) {
            sessionStorage.setItem("roleID", roleid);
            this.$router.push("/changeRole");
        }
    }
}
</script>