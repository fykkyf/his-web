<template>
    <div>
        <div>
            <el-form ref="employeeDTO" :model="patientOrderDTO" label-width="80px">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="6">
                        <el-form-item label="Patient ID">
                            <el-input v-model="patientOrderDTO.patient.patientId" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Status">
                            <el-radio-group v-model="patientOrderDTO.executionStatus">
                                <el-radio :label="1">Pending</el-radio>
                                <el-radio :label="2">Done</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                        <el-button type="success" icon="el-icon-search" @click="getByKeywordLong">查询患者长期医嘱</el-button>
                    </el-col> -->
                    <el-col :span="2">
                        <el-button type="success" icon="el-icon-search" @click="getByKeywordLong">Search</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <template>
                <el-table :data="patientOrders" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="patient.patientId" label="Patient ID">
                        <template slot-scope="scope">
                            {{ scope.row.patient !== null ? scope.row.patient.patientId : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="patient.patientId" label="Name">
                        <template slot-scope="scope">
                            {{ scope.row.patient !== null ? scope.row.patient.patientName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="employee.employeeName" label="Physician">
                        <template slot-scope="scope">
                            {{ scope.row.employee !== null ? scope.row.employee.employeeName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentName" label="Treatment">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentName !== null ? scope.row.treatmentName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="administration" label="Indication">
                        <template slot-scope="scope">
                            {{ scope.row.administration !== null ? scope.row.administration.administrationName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dosage" label="Dosage">
                        <template slot-scope="scope">
                            {{ scope.row.dosage !== null ? scope.row.dosage.dosageName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentCount" label="Number">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentCount !== null ? scope.row.treatmentCount : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="executionStatus" label="Status" :formatter="formatStatus">
                    </el-table-column>
                    <el-table-column prop="orderType" label="Prescribe">
                        <template slot-scope="scope">
                            {{ scope.row.orderType === 1 ? "One-time" : "Long-trem" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Operations" width="300px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleExecute(scope.$index, scope.row) " v-if="scope.row.executionStatus == 1"
                                type="success">Dispense</el-button>
                            <el-button size="mini" @click="handleReject(scope.$index, scope.row)" v-if="scope.row.orderType == 3"
                                type="warning">Reject</el-button>
                            <el-button size="mini" v-if="scope.row.orderType == 2" @click="handleCease(scope.$index, scope.row)"
                                type="danger">Stop</el-button>
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
                    statusText = "Pending";
                    break;
                case 2:
                    statusText = "Done";
                    break;
                case 3:
                    statusText = "Rejected";
                    break;
                case 4:
                    statusText = "Stopped";
                    break;
                default:
                    statusText = "Unknown";
            }
            return statusText;
        },
        //停止--4
        handleCease(index, row) {
            this.patientOrder = Object.assign({}, row, {
                treatment: {
                    treatmentId: row.treatmentId,
                    treatmentName: row.treatmentName,
                    treatmentCount: row.treatmentCount
                },
                executionStatus:4
            });
            row.executionStatus = 4;
            this.$axios.post("http://localhost/patientOrder/checkDischarge",this.patientOrder).then(resp=>{
                if(resp.data.code==200){
                    this.$message.success("停止成功");
                    this.getAllpatientOrders();
                }else{
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //驳回--3
        handleReject(index, row) {
            this.patientOrder = Object.assign({}, row, {
                treatment: {
                    treatmentId: row.treatmentId,
                    treatmentName: row.treatmentName,
                    treatmentCount: row.treatmentCount
                },
                executionStatus:3
            });
            this.$axios.post("http://localhost/patientOrder/checkDischarge",this.patientOrder).then(resp=>{
                if(resp.data.code==200){
                    this.$message.success("驳回成功");
                    this.getAllpatientOrders();
                }else{
                    this.$message.warning(resp.data.data)
                }
            })

        },
        //执行--2
        handleExecute(index, row) {
            this.patientOrder = Object.assign({}, row, {
                treatment: {
                    treatmentId: row.treatmentId,
                    treatmentName: row.treatmentName,
                    treatmentCount: row.treatmentCount
                },
                executionStatus:2
            });
            this.$axios.post("http://localhost/patientOrder/checkDischarge",this.patientOrder).then(resp=>{
                if(resp.data.code==200){
                    this.$message.success("执行成功");
                    this.getAllpatientOrders();
                    // window.location.reload();
                    // this.$router.go(0);
                }else{
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //根据关键字查询患者信息
        getByKeyword() {
            // this.patientOrderDTO.flog = 1;
            this.$axios.post("http://localhost/patientOrder/getByKeyWord", this.patientOrderDTO).then(resp => {
                if (resp.data.code === 200) {
                    this.patientOrders = resp.data.data.list;
                    this.total = resp.data.data.total;
                    this.$message.success("查询成功")
                } else {
                    this.$message.error("查询失败")
                }
            })
        },
        //根据关键字查询患者信息
        getByKeywordLong() {
            this.patientOrderDTO.flog = 1;
            this.$axios.post("http://localhost/patientOrder/getByKeyWordLong", this.patientOrderDTO).then(resp => {
                if (resp.data.code === 200) {
                    this.patientOrders = resp.data.data.list;
                    this.total = resp.data.data.total;
                    this.$message.success("查询成功")
                } else {
                    this.$message.error("查询失败")
                }
            })
        },
        //查询所有患者信息
        getAllpatientOrders(patientId) {
            //设置分页信息
            this.patientOrderDTO.pageNum = this.pageNum;
            this.patientOrderDTO.pageSize = this.pageSize;
            this.patientOrderDTO.patient = {
                patientId: patientId}
            this.$axios.post("http://localhost/patientOrder/get/all", this.patientOrderDTO).then(resp => {
                if (resp.data.code == 200) {
                    this.patientOrders = resp.data.data.patientOrders;
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
            // this.getAllpatientOrders()
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            // this.getAllpatientOrders();
        }
    },
    data() {
        return {
            patiientOrder:{
                treatment:{}
            },
            patientOrders: [],
            patientOrderDTO: {
                patient:{
                    patientId:''
                },
                // executionStatus:1
            },
            //所有科室
            units: [],
            employees: [],
            pageNum: 1,
            pageSize: 10,
            total: null,
            orderDialogVisible: false,
        }
    },
    created() {
        this.getAllpatientOrders()
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
</style>