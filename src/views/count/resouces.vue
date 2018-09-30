<template>
    <div id="resouces">
        <div class="flex-style">
            <el-progress v-for="(item, index) in handleResouce" type="circle" :percentage="item.value" :key="String(index)" :color="item.color" :stroke-width="strokeWidth"></el-progress>
        </div>
        <div class="flex-style">
            <div v-for="(item, index) in resouces" :key="'success' + String(index)" :class="'intro'+ (index + 1)">
                <div style="text-align: center;font-size: 16px;" class="title">{{ item.name }}</div>
                <div style="margin-top: 10px;padding-left:55px;">
                    <span>总数：</span>
                    <span>{{ item.total }} {{ item.unit }}</span>
                </div>
                <div style="margin-top: 5px;padding-left:55px;">
                    <span>已使用：</span>
                    <span>{{ item.use }} {{ item.unit }}</span>
                </div>
                <div style="margin-top: 5px;padding-left:55px;">
                    <span>未使用：</span>
                    <span>{{ item.remainder }} {{ item.unit }}</span>
                </div>
            </div>
        </div>
        
        <div style="margin: 50px 60px 0;">
            <el-radio-group v-model="radio" @change="radioChange">
                <el-radio-button label="存储空间"></el-radio-button>
                <el-radio-button label="扫描次数"></el-radio-button>
                <el-radio-button label="流量使用"></el-radio-button>
            </el-radio-group>
        </div>
        <ve-histogram 
            :data="chartData"
            :settings="chartSettings"
            :legend="legend"
            :colors="colors"
            :yAxis="yAxis"
            :xAxis="xAxis"
            :grid="grid"
            :title="title">
        </ve-histogram>
    </div>
</template>
<script>
import { getUserResourceInfo, getCountResource } from '@/api/count'
export default {
    data() {
        this.chartSettings = {
            labelMap:{
                usedSize: "主题"
            },
        }
        return {
            radio: "存储空间",
            resouces: [],
                      
            handleResouce: [],

            strokeWidth: 12,
            chartData: {
                columns: [],
                rows: []
            },
            title: {
                text: '消耗分析',
                textStyle: {
                    fontSize : 16,
                    fontFamily: "Microsoft YaHei",
                    fontWeight: "100"
                },
                left : 'center',
                top : 20
            },
            legend: [{
                bottom: 10,
                left: 100
            }],
            colors: ['#F56C6C', '#409EFF', '#909399'],
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
            xAxis: [{
                name: '主题',
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
                // max: 20,
                data: []
            }],
            grid: [{
                left: 60,
                top: 120
            }],
        }
    },
    created() {
        this.resouce();
    },
    methods: {
        /*** 资源统计*/
        resouce() {
            const params = {
                companyID: 1,
                userID: 1
            };
            getUserResourceInfo(params)
            .then(res => {
                this.handleResouce = [];
                this.resouces = [];
                this.resouces.push(res.data.netInfo, res.data.storageInfo, res.data.timeInfo);
                this.resouces.forEach((item, index) => {
                    this.handleResouce.push({
                        value: Number(((item.use/item.total)*100).toFixed(2)),
                        color: item.color
                    })
                });
            })
            .catch(err => {
                console.log(err);
            });
            getCountResource(params)
            .then(value => {
                if (value.code === 1) {
                    this.chartData.columns.push("themeName", "usedSize");
                    this.xAxis.data = [];
                    value.data.net.forEach((item, index) => {
                        this.chartData.rows.push({
                            themeName: item.themeName,
                            usedSize: item.usedSize,
                        });
                        this.$set(this.xAxis[0].data, index, item.themeName);
                    })
                }
            })
        },
        radioChange(label) {
            const params = {
                companyID: 1,
                userID: 1
            };
            getCountResource(params)
            .then(value => {
                if (value.code === 1) {
                    if (label == "存储空间") {
                        this.chartData.rows = [];
                        this.xAxis[0].data = [];
                        value.data.net.forEach((item, index) => {
                            this.chartData.rows.push({
                                themeName: item.themeName,
                                usedSize: item.usedSize,
                            });
                            this.$set(this.xAxis[0].data, index, item.themeName);                            
                        })
                    } else if (label == "扫描次数") {
                        this.chartData.rows = [];
                        this.xAxis[0].data = [];
                        value.data.scan.forEach((item, index) => {
                            this.chartData.rows.push({
                                themeName: item.themeName,
                                usedSize: item.usedSize,
                            });
                            this.$set(this.xAxis[0].data, index, item.themeName);
                        })
                    } else {
                        this.chartData.rows = [];
                        this.xAxis[0].data = [];
                        value.data.storage.forEach((item, index) => {
                            this.chartData.rows.push({
                                themeName: item.themeName,
                                usedSize: item.usedSize,
                            });
                            this.$set(this.xAxis[0].data, index, item.themeName);
                        })
                    }
                } 
            })
        }
    }
}
</script>
<style lang="scss">
#resouces {
    .flex-style {
        margin-top: 30px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-around;
        padding: 0 10%;
    }
    .intro1 {
        width: 240px;
        height: 145px;
        background: url(../../assets/img/blue.png) center no-repeat/cover;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;
        .title {
            color: #5d8ffc;
        }
        div {
            font-size: 14px;
            span:nth-of-type(1) {
                color: #444;
            }
            span:nth-of-type(2) {
                color: #777;
            }
        }
    }
    .intro2 {
        width: 240px;
        height: 145px;
        background: url(../../assets/img/r.png) center no-repeat/cover;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;   
        .title {
            color: #f95c5c;
        }
        div {
            font-size: 14px;
            span:nth-of-type(1) {
                color: #444;
            }
            span:nth-of-type(2) {
                color: #777;
            }
        }
    }
    .intro3 {
        width: 240px;
        height: 145px;
        background: url(../../assets/img/p.png) center no-repeat/cover;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: center;       
        .title {
            color:  #9161c3;
        }
        div {
            font-size: 14px;
            span:nth-of-type(1) {
                color: #444;
            }
            span:nth-of-type(2) {
                color: #777;
            }
        }
    }
}
</style>
