<template>
    <div id="staff-table">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>基础配置</el-breadcrumb-item>
                    <el-breadcrumb-item class="firstbread">员工管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main>
                <el-row type="flex" justify="space-between" class="screenRow">
                    <div>
                        <el-select placeholder="全部" 
                            v-model="screen.status" 
                            style="width: 100px;"
                            @change="isEnabled">
                            <el-option v-for="item in options" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"></el-option>
                        </el-select>
                        <el-select placeholder="所属角色" 
                            v-model="screen.role" 
                            style="width: 100px;"
                            @change="isEnabled"
                            clearable>
                            <el-option v-for="item in roles" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"></el-option>
                        </el-select>
                        <el-input style="width: 300px;" 
                            v-model="screen.staffName" 
                            clearable 
                            placeholder="请输入员工姓名"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="getTableData(1)">搜索</el-button>
                    </div>
                    <el-button type="primary" @click="$router.push('/addStaff')">新建员工</el-button>
                </el-row>
                <!-- 表格 -->
                <el-table 
                    :data="tableData" 
                    style="width: 100%;margin-top: 20px;" 
                    stripe
                    element-loading-text="拼命加载中">
                    <el-table-column 
                        type="index" 
                        :index="handleIndex"
                        label="序号" 
                        align="center">            
                    </el-table-column>
                    <el-table-column label="姓名" prop="employeeName">
                        <template slot-scope="scope">
                            <div class="title-name">{{scope.row.employeeName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="登录账号" align="center" prop="employeeAccount">
                        
                    </el-table-column>
                    <el-table-column label="所属角色" align="center" prop="roleName">
                        
                    </el-table-column>
                    <el-table-column label="最后登录时间" align="center" prop="finalLoginDate">

                    </el-table-column>
                    <el-table-column label="开启状态" align="center">
                        <template slot-scope="scope" 
                            v-if="scope.row.employeeNo != '0000'">
                            <el-switch 
                                v-model="scope.row.status"
                                @change="transformSwitch(scope.row.employeeID, scope.row.status)"
                                :active-value="switchopen"
                                :inactive-value="switchclose"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope"
                            v-if="scope.row.employeeNo != '0000'">
                            <el-tooltip class="item" effect="light" content="修改" placement="top-start"
                                @click.native="turnModify(scope.row.employeeID)">
                                <icon-svg icon-class="bianji"></icon-svg>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="删除" placement="top-start" 
                                @click.native="DEL(scope.row.employeeID)">
                                <icon-svg icon-class="shanchu" style="font-size: 18px;"></icon-svg>
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
import { staffList, staffStatus, delStaff } from '@/api/staff'
import { roleList } from '@/api/role'
import IconSvg from '@/components/SvgIcon/index'
export default {
    name: "staff",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            handleCurrent: 1,
            handleSize: 10,
            // 筛选
            screen: {
                status: "",
                role: "",
                staffName: ""
            },
            roles: [],
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
            switchclose: 0
        }
    },
    components: {
        IconSvg
    },
    created() {
        this.getTableData(1);
    },
    mounted() {
        this.findroles();
    },
    methods: {
        handleCurrentChange(val) {
            this.handleCurrent = val;
            this.getTableData(val);
        },
        handleSizeChange(val) {
            this.handleSize = val;
            this.getTableData(1);
        },
        /**
         * 获取表格数据
         * @param [page] 第几页
         */
        getTableData(page) {
            const params = {
                pageNo: page,
                pageSize: this.handleSize,
                companyID: this.companyID,
                userID: this.userID,
                status: this.screen.status,
                roleID: this.screen.role,
                name: this.screen.staffName
            };
            staffList(params)
            .then(res => {
                if (res.code === 1) {
                    this.tableData = res.data.list;
                    this.tableTotal = res.data.totalSize;
                } else {
                    this.tableData = [];
                    this.tableTotal = 0;
                }
            })
        },
        /***获取roles*/
        findroles() {
            //添加时首先清空
            this.roles = [];
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                pageNo: 1,
                pageSize: 100,
                status: "",
                name: ""
            };
            roleList(params)
            .then(val => {
                if (val.code === 1) {
                    val.data.list.forEach((item, index) => {
                        this.roles.push({
                            value: item.roleID,
                            label: item.roleName
                        })
                    })
                }
            })
        },
        /**
         * 改变状态触发请求
         * @param [status] 状态 id 员工id
         */
        transformSwitch(id, status) {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                id: id,
                status: status
            };
            this.$confirm('这个操作会改变状态, 确定吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(staffStatus(params));
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
         * 删除
         * @param [id] 员工id
         */
        DEL(id) {
            const params = {
                companyID: this.companyID,
                userID: this.userID,
                id: id,
                status: -1
            };
            this.$confirm('这个操作会永久删除,确定吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
            .then(() => {
                return Promise.resolve(delStaff(params));
            })
            .then(res => {
                if (res.code === 1) {
                    this.$message.success(res.msg);
                    this.getTableData(this.handleCurrent);
                }
            })
            .catch(err => {
                this.$message.info("已经取消删除");
            })
        },
        /** * 筛选是否可用*/
        isEnabled() {
            this.handleCurrent = 1;
            this.getTableData(this.handleCurrent);
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
        turnModify(id) {
            sessionStorage.setItem("employeeID", id);
            this.$router.push("/modifyStaff");
        }
    }
}
</script>
