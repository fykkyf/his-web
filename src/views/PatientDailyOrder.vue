<template>
    <div>
        <div>
            <el-form ref="patientOrderDTO" :model="patientOrderDTO" label-width="80px">
                <el-row type="flex" class="row-bg" justify="start">
                    <el-col :span="6">
                        <el-form-item label="Patient ID:">
                            <el-input v-model="patientOrderDTO.patient.patientId" placeholder="" ></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="15"></el-col>
                    <el-col :span="2">
                        <el-button type="success" icon="el-icon-search" @click="getAllPatientOrdersByDaily">Search</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <template>
                <el-table :data="patientOrders" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="patientBillId" label="Bill Order ID" >
                        <template slot-scope="scope">
                            {{ scope.row.patientBillId !== null ? scope.row.patientBillId : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="patientName" label="Patient Name">
                        <template slot-scope="scope">
                            {{ scope.row.patientName !== null ? scope.row.patientName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentId" label="Treatment ID" >
                        <template slot-scope="scope">
                            {{ scope.row.treatmentId !== null ? scope.row.treatmentId : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentName" label="Treatment">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentName !== null ? scope.row.treatmentName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="drugCount" label="Number">
                        <template slot-scope="scope">
                            {{ scope.row.drugCount !== null ? scope.row.drugCount : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="Price">
                        <template slot-scope="scope">
                            {{ scope.row.amount !== null ? scope.row.amount : "None" }}
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-sizes="[10, 15, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
  
<script>
export default {
    methods: {
        formatStatus(row) {
            const status = row.executionStatus;
            // 根据状态值返回对应的中文字符串
            let statusText = "";
            switch (status) {
                case 1:
                    statusText = "待审核";
                    break;
                case 2:
                    statusText = "已执行";
                    break;
                case 3:
                    statusText = "已驳回";
                    break;
                case 4:
                    statusText = "已停止";
                    break;
                default:
                    statusText = "未知";
            }
            return statusText;
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        //查询所有患者信息
        getAllPatientInfos() {
            this.$axios.get("http://localhost/patientInfo/getByDoctorId").then(resp => {
                if (resp.data.code == 200) {
                    this.patientInfos = resp.data.data;
                } else {
                    this.$message.warning(resp.data.data)
                }
            })
        },
        getAllPatientOrdersByDaily() {
            //设置分页信息
            this.patientOrderDTO.pageNum = this.pageNum;
            this.patientOrderDTO.pageSize = this.pageSize;
            this.$axios.post("http://localhost/patientOrder/get/daily", this.patientOrderDTO).then(resp => {
                if (resp.data.code == 200) {
                    console.log(resp.data.data)
                    this.patientOrders = resp.data.data.patientBills;
                    this.total = resp.data.data.total;
                } else {
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //各行换色
        tableRowClassName({ row, rowIndex }) {
            if ((rowIndex + 1) % 4 === 2) {//2,6,10..
                return 'warning-row';
            } else if ((rowIndex + 1) % 4 === 0) {//4,8,12..
                return 'success-row';
            }
        },
        //分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAllPatientOrdersByDaily()
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getAllPatientOrdersByDaily();
        }
    },
    data() {
        return {
            patientInfos:[],
            patientOrders: [],
            patientOrderDTO:{
                patient:{}
            },
            pageNum: 1,
            pageSize: 10,
            total: null,
        }
    },
    created() {
        // this.getAllPatientInfos();
    }
}
</script>
  
<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>