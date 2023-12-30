<template>
    <div>
        <div>
            <!-- 病人信息 -->
        </div>
        <div>
            <el-form ref="patientOrderDTO" :model="patientOrderDTO" label-width="80px">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="4">
                        <el-form-item label="Treatment：">
                            <el-select v-model="patientOrderDTO.treatment.treatmentId" clearable placeholder="Select">
                                <el-option v-for="item in treatments" :key="item.treatmentId" :label="item.treatmentName"
                                    :value="item.treatmentId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="Status">
                            <el-radio-group v-model="patientOrderDTO.executionStatus">
                                <el-radio :label="1">Pending</el-radio>
                                <el-radio :label="3">Rejected</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Medication " >
                            <el-radio-group v-model="patientOrderDTO.orderType">
                                <el-radio :label="1">Short Term</el-radio>
                                <el-radio :label="2">Long Term</el-radio>
                                <el-radio :label="''">Unlimited</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="success" icon="el-icon-search" @click="getByKeyword">Search</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <template>
                <el-table :data="patientOrders" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="patientOrderId" label="Order #" width="120px">
                        <template slot-scope="scope">
                            {{ scope.row.patientOrderId !== null ? scope.row.patientOrderId : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentId" label="Treatment #" width="120px">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentId !== null ? scope.row.treatmentId : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentName" label="Treatment" width="300">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentName !== null ? scope.row.treatmentName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="administration.administrationId" label="Indication">
                        <template slot-scope="scope">
                            {{ scope.row.administration !== null ? scope.row.administration.administrationName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dosage.dosageId" label="Dosage">
                        <template slot-scope="scope">
                            {{ scope.row.dosage !== null ? scope.row.dosage.dosageName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="treatmentCount" label="Number">
                        <template slot-scope="scope">
                            {{ scope.row.treatmentCount !== null ? scope.row.treatmentCount : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderType" label="Type" width="90">
                        <template slot-scope="scope">
                            {{ scope.row.orderType === 1 ? "Short" : "Long" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="executionTime" label="Execution Time">
                        <template slot-scope="scope">
                            {{ scope.row.executionTime !== null ? formatDate(scope.row.executionTime) : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="executionStatus" label="Status" :formatter="formatStatus">
                    </el-table-column>
                    <el-table-column label="Operations" width="200px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleModifyOrder(scope.row)" type="warning" v-if="scope.row.executionStatus == 1 || scope.row.executionStatus == 3">Edit</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!-- 修改医嘱 -->
        <div>
            <el-dialog title="Prescribe Information" :visible.sync="orderDialogVisible" width="80%" center>
                <el-form :model="patientOrderDTO">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="10">
                            <el-form-item label="Treatment Detail:" label-width="150px">
                                <el-select v-model="patientOrderDTO.treatment.treatmentId" clearable placeholder="" >
                                    <el-option v-for="item in treatments" :key="item.treatmentId"
                                        :label="item.treatmentName" :value="item.treatmentId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Discharge Diagnosis:" v-if="patientOrderDTO.treatment.treatmentId == 7" label-width="150px">
                                <el-select v-model="patientOrderDTO.dischargeDiagnosis.diseaseId" placeholder="">
                                    <el-option v-for="item in dischargeDiagnoses" :key="item.diseaseId"
                                        :label="item.diseaseName" :value="item.diseaseId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Indication:" v-if="patientOrderDTO.treatment.treatmentId !== 7" label-width="150px">
                                <el-select v-model="patientOrderDTO.administrationId" clearable placeholder="">
                                    <el-option v-for="item in administrations" :key="item.administrationId"
                                        :label="item.administrationName" :value="item.administrationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Dosage:" v-if="patientOrderDTO.treatment.treatmentId !== 7" label-width="150px">
                                <el-select v-model="patientOrderDTO.dosageId" clearable placeholder="">
                                    <el-option v-for="item in dosages" :key="item.dosageId" :label="item.dosageName"
                                        :value="item.dosageId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Number:" v-if="patientOrderDTO.treatment.treatmentId !== 7" label-width="150px">
                                <el-input v-model="patientOrderDTO.treatment.treatmentCount"
                                    style="width: 200px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handlerCancel()">Cancel</el-button>
                    <el-button type="primary" @click="submitPatientOrder()">Submit</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
export default {
    methods: {
        //时间格式转换
        formatDate(date) {
            if (date !== null) {
                const formattedDate = this.$moment(date, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm');
                return formattedDate;
            } else {
                return 'None';
            }
        },
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

        //取消
        handlerCancel() {
            this.orderDialogVisible = false;
            this.patientOrderDTO = {
                treatment: {},
                patient: {},
                administration: {},
                dosage: {},
                dischargeDiagnosis: {}
            }
        },
        //查看医嘱信息
        handleModifyOrder(row) {
            console.log(row)
            if (row.administration != null) {
                this.patientOrderDTO = Object.assign({}, row, {
                    treatment: {
                        treatmentId: row.treatmentId,
                        treatmentName: row.treatmentName,
                        treatmentCategory: '',
                        treatmentCount: row.treatmentCount
                    },
                    patient: {
                        patientId: this.$route.query.patientId
                    },
                    administration: {
                        administrationId: row.administration.administrationId,
                        administrationName: row.administration.administrationName
                    },
                    dosage: {
                        dosageId: row.dosage.dosageId,
                        dosageName: row.dosageName
                    },
                    dischargeDiagnosis: {
                        diseaseId: '',
                        diseaseName: ''
                    },
                });
            } else {
                this.patientOrderDTO = Object.assign({}, row, {
                    treatment: {
                        treatmentId: row.treatmentId,
                        treatmentName: row.treatmentName,
                        treatmentCategory: '',
                        treatmentCount: row.treatmentCount
                    },
                    patient: {
                        patientId: this.$route.query.patientId
                    },
                    administration: {
                        administrationId: '',
                        administrationName: ''
                    },
                    dosage: {
                        dosageId: '',
                        dosageName: ''
                    },
                    dischargeDiagnosis: {
                        diseaseId: '',
                        diseaseName: ''
                    },
                });
            }
            this.getAllAdministrations();
            this.getAllDosages();
            this.getAllDischargeDiagnosis();
            this.orderDialogVisible = true
        },
        //时间格式转换

        //修改医嘱---确认按钮
        submitPatientOrder() {
            this.$axios.post("http://localhost/patientOrder/modify", this.patientOrderDTO).then(resp => {
                if (resp.data.code == 200) {
                    this.$message.success("Edit Success")
                    this.getAllPatientOrdersByPatientId(this.$route.query.patientId)
                    this.patientOrderDTO = {treatment:{},executionStatus:1,patient:{}};
                    this.orderDialogVisible = false;
                } else {
                    this.$message.warning(resp.data.data);
                }
            })
        },
        //查询所有疾病
        getAllDischargeDiagnosis() {
            this.$axios.get("http://localhost/disease/get/all").then(resp => {
                if (resp.data.code == 200) {
                    this.dischargeDiagnoses = resp.data.data
                } else {
                    this.$message.warning(resp.data.data)
                }
            })

        },
        //查询所有用量信息
        getAllDosages() {
            this.$axios.get("http://localhost/dosage/getAll").then(resp => {
                if (resp.data.code == 200) {
                    this.dosages = resp.data.data
                } else {
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //查询所有用法信息
        getAllAdministrations() {
            this.$axios.get("http://localhost/administration/getAll").then(resp => {
                if (resp.data.code == 200) {
                    this.administrations = resp.data.data
                } else {
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //查询所有项目
        getAllTreatments() {
            let treatmentDTO = {
                treatmentCategory: this.patientOrderDTO.treatment.treatmentCategory,
            }
            this.$axios.post("http://localhost/treatment/selectAllTreatmentByCategory", treatmentDTO).then(resp => {
                if (resp.data.code == 200) {
                    this.treatments = resp.data.data
                } else {
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //根据关键字查询患者信息
        getByKeyword() {
            this.patientOrderDTO.patient = { patientId: this.$route.query.patientId };
            this.$axios.post("http://localhost/patientOrder/getByKeyWord", this.patientOrderDTO).then(resp => {
                if (resp.data.code === 200) {
                    this.patientOrders = resp.data.data.list;
                    this.$message.success("Search Success")
                } else {
                    this.$message.error("Search Failed")
                }
            })
        },
        //查询所有医嘱信息
        getAllPatientOrdersByPatientId(patientId) {
            this.$axios.get("http://localhost/patientOrder/getById/" + patientId).then(resp => {
                if (resp.data.code == 200) {
                    this.patientOrders = resp.data.data
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
    },
    data() {
        return {
            patientOrders: [],
            patientOrderDTO: {
                executionStatus:1,
                dischargeDiagnosis: {
                    diseaseId: '',
                    diseaseName: ''
                },
                treatment: {
                    treatmentId: '',
                    treatmentName: '',
                    treatmentCategory: '',
                    treatmentCount: ''
                },
                patient: {
                    patientId: ''
                },
                administration: {
                    administrationID: '',
                    administrationName: ''
                },
                dosage: {
                    dosageId: '',
                    dosageName: ''
                }
            },
            //所有科室
            units: [],
            employees: [],
            orderDialogVisible: false,

            treatments: [],
            administrations: [],
            dosages: [],
            dischargeDiagnoses: [],
        }
    },
    created() {
        this.getAllPatientOrdersByPatientId(this.$route.query.patientId);
        this.getAllTreatments();
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