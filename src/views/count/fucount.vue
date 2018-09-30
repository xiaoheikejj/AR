<template>
    <div id="fucount">
        <!-- 主题列表 -->
        <el-select v-model="activitySelect.active" @change="selectChange">
            <el-option 
                v-for="(item, index) in activitySelect.list" 
                :label="item.label" 
                :value="item.value" 
                :key="String(index)"></el-option>
        </el-select>
        <div style="margin-top: 20px;">
            <el-date-picker
                v-model="recognitionTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="conTime">
            </el-date-picker>
            <el-radio-group v-model="recognitionRadio" @change="recognitionChange">
                <el-radio-button :label="recognitionSelectTime.today">今日</el-radio-button>
                <el-radio-button :label="recognitionSelectTime.yesterday">昨日</el-radio-button>
                <el-radio-button :label="recognitionSelectTime.week">七日</el-radio-button>
                <el-radio-button :label="recognitionSelectTime.months">三十天</el-radio-button>
            </el-radio-group>
        </div>    
        <div style="position: relative" class="echarts">
            <ve-line 
            :data="chartData"
            :colors="colors"
            :xAxis="xAxis"
            :yAxis="yAxis"
            :legend="legend"
            :grid="grid"
            :title="title"
            :data-empty="dataEmpty"></ve-line>
            <!-- <i class="el-icon-download" style="position: absolute;right: 100px;top: 20px;font-size: 30px;cursor: pointer;" @click="download"></i> -->
            <ul v-show="ul_li_show">
                <li>
                    <span>识别次数</span>
                    <span>{{countNum.scan}}</span>
                </li>
                <li>
                    <span>参与人数</span>
                    <span>{{countNum.user}}</span>
                </li>
                <li>
                    <span>中奖人数</span>
                    <span>{{countNum.cash}}</span>
                </li>
            </ul>
        </div>   

        <div class="msgtable" v-if="tableShow">
            <el-table
                :data="tableData"
                style="width: 100%"
                stripe>
                <el-table-column
                    prop="week"
                    label="时间"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="scanNum"
                    label="识别次数"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userNum"
                    label="参与人数"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="cashNum"
                    label="中奖人数"
                    align="center">
                </el-table-column>
            </el-table>
        </div>     
    </div>
</template>
<script>
import { activitygetCount } from '@/api/count'
import { getCorrectTime } from '@/utils/timeStamp'
import { activityList } from '@/api/activity'
export default { 
    name: "fucount",
    data() {
        return {
            companyID: sessionStorage.getItem("companyID"),
            userID: sessionStorage.getItem("userID"),
            productID: sessionStorage.getItem("activityProductID"),
            activitySelect: {
                active: '',
                list: [] 
            },  //  活动列表
            recognitionRadio: '',  //日期按照时间戳来传递
            recognitionTime: [],    //开始时间结束时间
            //今日，昨天，本周，本月
            recognitionSelectTime: {
                today: '',
                yesterday: '',
                week: '',
                months: ''
            },
            // 识别分析表格数据
            chartData: {
                columns: ['日期', '识别次数', '参与人数', '中奖人数'],
                rows: []
            },
            tableData: [],
            title: {
                text: '活动综合分析',
                textStyle: {
                    fontSize : 16,
                    fontFamily: "Microsoft YaHei",
                    fontWeight: "100"
                },
                left : 'center',
                top : 20
            },
            colors: ['#F56C6C', '#409EFF', '#909399'],
            xAxis: [{
                name: '时间',
                nameLocation: 'center',
                type: 'category',
                nameTextStyle: {
                    padding: [25, 0, 0, 0],
                    fontSize: 14,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        opacity: 0.4
                    }
                },
                axisTick: {
                    show: true,
                    alignWithLabel: true
                },
            }],
            legend: [{
                bottom: 10,
                left: 100
            }],
            yAxis: [{
                name: '次数',
                nameLocation: 'center',
                nameTextStyle: {
                    fontSize: 14,
                },
                nameGap:40,
                nameRotate: 0,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        opacity: 0.4
                    }
                },
            }],
            grid: [{
                left: 60,
                top: 120
            }],
            dataEmpty: false,
            ul_li_show: true,
            // 总数
            countNum: {
                scan: 0,
                user: 0,
                cash: 0
            },
            tableShow: false,
        }
    },
    created() {
        this.getActivity(this.activitySelect.list);
    },
    mounted() {
        this.recognitionTime = [];
        this.confirmTime(this.recognitionSelectTime);
        this.recognitionRadio = this.recognitionSelectTime.today;
        // 首次渲染的是今天的时间
        //通过bind把this指向window改成vue实例
        setTimeout(function () {
            this.activitySelect.active = this.activitySelect.list[0].label;
            this.recognitionSubmit(getCorrectTime(this.recognitionRadio), getCorrectTime(new Date().getTime()));
            this.recognitionTime.push(getCorrectTime(this.recognitionRadio), getCorrectTime(new Date().getTime()));
        }.bind(this), 1000)
    },
    //数据更新后在这处理
    updated() {
        //不能在updated里面给activitySelect.active默认值,select变化会触发activitySelect.active的值的变化,
        // data里值的变化会不断触发updated里面代码的执行
    },
    methods: {
        /**
         * select选择框变化时
         */
        selectChange() {
            this.confirmTime(this.recognitionSelectTime);
            this.recognitionRadio = this.recognitionSelectTime.today;
            this.recognitionSubmit(getCorrectTime(this.recognitionRadio),getCorrectTime(new Date().getTime()));
        },
        /**
         * 活动列表
         * @param [obj] 需要被放入数据的对象
         */
        getActivity(obj) {
            const params = {
                pageNo: 1,
                pageSize: 10,
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                status: "",
                name: ""
            };
            activityList(params)
            .then(res => {
                res.data.list.forEach(item => {
                    obj.push({
                        value: item.activityID,
                        label: item.activityName
                    })
                })
            })
        },
        /**
         * 今天，昨天的时间戳。。。begintime
         * @param [obj] 保存时间的对象
         */
        confirmTime(obj) {
            const str = new Date(new Date().toLocaleDateString()).getTime();
            obj.today = str;
            obj.yesterday = str - 3600 * 1000 * 24;
            obj.week = str - 3600 * 1000 * 24 * 7;
            obj.months = str - 3600 * 1000 * 24 * 30;
        },
        /**
         * 单选按钮切换
         */
        recognitionChange(time) {
            this.recognitionTime = [];
            const str = new Date(new Date().toLocaleDateString()).getTime();
            if (str == time) {
                this.recognitionSubmit(getCorrectTime(time), getCorrectTime(new Date().getTime()));
                //选择时间的框里面加入今天的时间
                this.recognitionTime.push(getCorrectTime(time), getCorrectTime(new Date().getTime()));
            } else {
                this.recognitionSubmit(getCorrectTime(time), getCorrectTime(str - 1));
                //选择时间的框里面加入昨天，7天，30天的时间
                this.recognitionTime.push(getCorrectTime(time), getCorrectTime(str - 1));
            }
        },
        /**
         * 发送请求
         * @param [begintime] 开始时间时间戳
         * [endtime] 结束时间时间戳
         */
        recognitionSubmit(begintime, endtime) {
            const dd = new Date();
            const time = dd.getFullYear() + '-' + (dd.getMonth() + 1) + '-' + dd.getDate() + ' 00:00:00';
            // 根据lists里面的获取label所对应的value
            this.activitySelect.list.forEach(item => {
                if (item.label == this.activitySelect.active) {
                    this.activitySelect.active = item.value;
                }
            });
            const params = {
                companyID: this.companyID,
                productID: this.productID,
                userID: this.userID,
                themeID: this.activitySelect.active,
                beginTime: begintime,
                endTime: endtime,
            };
            //每次请求之前刷新空文件
            this.chartData.rows = [];
            this.tableData = [];
            this.countNum.scan = 0;
            this.countNum.user = 0;
            this.countNum.cash = 0;
            
            activitygetCount(params)
            .then(res => {
                if (res.code === 1) {
                    this.dataEmpty = false;
                    this.ul_li_show = true;
                    res.data.countInfo.forEach(ele => {
                        this.chartData.rows.push({
                            '日期': ele.week,
                            '识别次数': ele.scanNum,
                            '参与人数': ele.userNum,
                            '中奖人数': ele.cashNum
                        });
                        //总数
                        this.countNum.scan += ele.scanNum;
                        this.countNum.user += ele.userNum;
                        this.countNum.cash += ele.cashNum;
                    })
                    this.tableData = res.data.countInfo;
                } else {
                    this.dataEmpty = true;
                    this.ul_li_show = false;
                    this.$message.warning("活动统计暂无数据");
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        /**
         * 确认时间后发起的请求
         */
        conTime(maxDate) {
            if (Object.prototype.toString.call(maxDate) == "[object Array]") {
                this.recognitionSubmit(getCorrectTime(new Date(maxDate[0]).getTime()), getCorrectTime(new Date(maxDate[1]).getTime())); 
            } else {
                this.recognitionSubmit(0, 0);
            }
        },
        /**
         * 下载表格文件
         */
        download() {
            // Ajax('/bleAdmin/getCsvFile', 'get')
            // .then(res => {
            //     window.location.href = res.extend.url;
            // })
            // .catch(err => {
            //     this.$message({
            //         message: '没有数据可以下载',
            //         type: 'error'
            //     })
            // })
        },
        
    }
}
</script>
<style lang="scss">
#fucount {
    .echarts {
        ul {
            position: absolute;
            top: 40px;
            left: 80px;
            display: -webkit-flex;
            display: flex;
            li {
                margin-right: 20px;
                span {
                    display: block;
                    text-align: center;
                    font-size: 14px;
                    color: #333;
                }
                & span:nth-of-type(2) {
                    margin-top: 10px;
                    font-weight: normal;
                    color: #777;
                }
            }
        }
    }
    .msgtable {
        position: relative;
        i {
            position: absolute;
            right: 20px;
            top: 0;
            font-size: 30px;
        }
    }
}
</style>


