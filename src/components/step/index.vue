<template>
    <el-steps finish-status="success" align-center>
        <el-step title="基础配置" :status="status1"></el-step>
        <el-step title="九宫格配置" :status="status2"></el-step>
    </el-steps>
</template>
<script>
export default {
    data() {
        return {
            status1: this.wait,
            status2: this.success
        }
    },
    props: ["wait", "success"]
}
</script>

