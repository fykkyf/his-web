<template>
    <div>
        <div>
            <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="6">
                        <el-form-item label="Patient ID">
                            <el-input placeholder="" v-model="patientInfoDTO.patientId" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="DL">
                            <el-input placeholder="Driver's License" v-model="patientInfoDTO.idNumber" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Gender">
                            <el-radio-group v-model="patientInfoDTO.gender">
                                <el-radio :label="1">Male</el-radio>
                                <el-radio :label="2">Female</el-radio>
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
                <el-table :data="patientInfos" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="patientId" label="ID" width="50px">
                        <template slot-scope="scope">
                            {{ scope.row.patientId !== null ? scope.row.patientId : "None" }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="visitorId" label="门诊编号" width="80px">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.visitorId !== null ? scope.row.visitorId : "暂无信息" }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column prop="patientName" label="Name" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.patientName !== null ? scope.row.patientName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="gender" label="Gender" width="80px">
                        <template slot-scope="scope">
                            {{ scope.row.gender === 1 ? 'Male' : 'Female' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="age" label="Age" width="60px">
                        <template slot-scope="scope">
                            {{ scope.row.age !== null ? scope.row.age : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="Unit" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.unit !== null ? scope.row.unit.unitName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="employee" label="Physician" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.employee !== null ? scope.row.employee.employeeName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuranceStatus" label="Ins"
                        :filters="[{ text: 'No', value: '1' }, { text: 'Yes', value: '2' }]" :filter-method="filterTag"
                        filter-placement="bottom-end" width="70px">
                        <template slot-scope="scope">
<!--                            <el-tag :type="scope.row.insuranceStatus === 1 ? 'primary' : 'success'" disable-transitions>{{-->
<!--                                scope.row.insuranceStatus === 1 ? '无' : '有' }}</el-tag>-->
                          <el-tag :type="scope.row.insuranceStatus === 1 ? 'primary' : 'danger'" disable-transitions>
                            <i v-if="scope.row.insuranceStatus === 1" class="el-icon-check"></i>
                            <i v-else class="el-icon-minus"></i>
                          </el-tag>

                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="insuranceStatus" label="医保">
                        <template slot-scope="scope">
                            {{ scope.row.insuranceStatus === 2 ? '有' : '无' }}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="inTime" label="AT" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.inTime !== null ? formatDate(scope.row.inTime) : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="outTime" label="DT" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.outTime !== null ? formatDate(scope.row.outTime) : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Diagnosis" width="100px">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>Previous Diagnosis: {{ scope.row.clinicDiagnosis !== null ? scope.row.clinicDiagnosis.diseaseName :
                                    "None" }}</p>
                                <p>Admission Diagnosis: {{ scope.row.admissionDiagnosis !== null ? scope.row.admissionDiagnosis.diseaseName
                                    : "None" }}</p>
                                <p>Discharge Diagnosis: {{ scope.row.dischargeDiagnosis !== null ? scope.row.dischargeDiagnosis.diseaseName
                                    : "None" }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" type="danger">Diagnosis</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="Vital Signs" width="100px">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>BP: {{ scope.row.regularResult !== null ? scope.row.regularResult.pressure + ' mmHg' :
                                    "None" }}</p>
                                <p>BS: {{ scope.row.regularResult !== null ? scope.row.regularResult.sugar + ' mmol/L'
                                    : "None" }}</p>
                                <p>BT: {{ scope.row.regularResult !== null ? scope.row.regularResult.temp + ' °C'
                                    : "None" }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" type="success">Vital Signs</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="clinicDiagnosis" label="门诊诊断">
                        <template slot-scope="scope">
                            {{ scope.row.clinicDiagnosis !== null ? scope.row.clinicDiagnosis.diseaseName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="admissionDiagnosis" label="入院诊断">
                        <template slot-scope="scope">
                            {{ scope.row.admissionDiagnosis !== null ? scope.row.admissionDiagnosis.diseaseName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dischargeDiagnosis" label="出院诊断">
                        <template slot-scope="scope">
                            {{ scope.row.dischargeDiagnosis !== null ? scope.row.dischargeDiagnosis.diseaseName : "暂无信息" }}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="location" label="Location" width="90px">
                        <template slot-scope="scope">
                            {{ scope.row.location !== null ? scope.row.location.locationName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="paidTime" label="PT" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.paidTime !== null ? formatDate(scope.row.paidTime) : "Not Yet" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stayStatus" label="Status">
                        <template slot-scope="scope">
                            {{ scope.row.stayStatus === 1 ? "Still In" : "DC" }}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="paymentStatus" label="支付状态">
                        <template slot-scope="scope">
                            {{ scope.row.paymentStatus === 1 ? "未结算" : "已结算" }}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="Operations" width="300px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="success"
                                :disabled="scope.row.stayStatus != 1">Prescribe</el-button>
                            <el-button size="mini" :disabled="scope.row.stayStatus != 1"
                                @click="handleCheckOrder(scope.row)" type="primary">Details</el-button>
                            <el-button type="warning" size="mini" :disabled="scope.row.stayStatus != 1"
                                @click="openImage(scope.row)">Results</el-button>
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
        <!-- 下医嘱 -->
        <div>
            <el-dialog title="Prescribe Information" :visible.sync="orderDialogVisible" width="80%" center>
                <el-form :model="patientOrderDTO">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="10">
                            <el-form-item label="Patient Name:" label-width="150px">
                                <el-input v-model="patientOrderDTO.patientName" disabled style="width: 200px;"></el-input>
                            </el-form-item>
                            <el-form-item label="Treatment Type:" label-width="150px">
                                <el-select v-model="patientOrderDTO.treatment.treatmentCategory" placeholder=""
                                    @change="getAllTreatments">
                                    <el-option label="Medication" value="1"></el-option>
                                    <el-option label="Physical Treatment" value="2"></el-option>
                                    <el-option label="Lab Test" value="3"></el-option>
                                    <el-option label="Radiology Test" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="PO Type:" v-if="patientOrderDTO.treatment.treatmentCategory == 1" label-width="150px">
                                <el-radio-group v-model="patientOrderDTO.orderType">
                                    <el-radio :label="1">Short Term</el-radio>
                                    <el-radio :label="2">Long Term</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="Treatment Detail:" label-width="150px">
                                <el-select v-model="patientOrderDTO.treatment.treatmentId" clearable placeholder="">
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
                            <el-form-item label="Indication:" v-if="patientOrderDTO.treatment.treatmentCategory == 1" label-width="150px">
                                <el-select v-model="patientOrderDTO.administrationId" clearable placeholder="">
                                    <el-option v-for="item in administrations" :key="item.administrationId"
                                        :label="item.administrationName" :value="item.administrationId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Dosage:" v-if="patientOrderDTO.treatment.treatmentCategory == 1" label-width="150px">
                                <el-select v-model="patientOrderDTO.dosageId" clearable placeholder="">
                                    <el-option v-for="item in dosages" :key="item.dosageId" :label="item.dosageName"
                                        :value="item.dosageId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Number:" v-if="patientOrderDTO.treatment.treatmentCategory == 1" label-width="150px">
                                <el-input v-model="patientOrderDTO.treatment.treatmentCount"
                                    style="width: 200px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="orderDialogVisible = false;
                    patientOrderDTO = { treatment: {} }">Cancel</el-button>
                    <el-button type="primary" @click="submitPatientOrder()">Submit</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
export default {
    methods: {
        //查看图片
        openImage(row) {
            console.log(row.visitorId);
            this.$axios
                .post(
                    "http://localhost/patientRaidology/getPictureFileName" +
                    "/" +
                    row.patientId
                )
                .then((res) => {
                    if (res.data.code == 200) {
                        this.fileName = res.data.data;
                        if (this.fileName && this.fileName !== "./null") {
                            // 检查 this.fileName 是否为空或者是否为 './null'
                            let url = require("@/assets/images/" + this.fileName);
                            window.open(url, "_blank");
                        } else {
                            this.$message({
                                message: "No Result",
                                type: "error",
                            });
                        }
                    } else {
                        this.$message({
                            message: "No Result",
                            type: "error",
                        });
                    }
                });
        },
        //查看医嘱信息
        handleCheckOrder(row) {
            this.$router.push({ path: "/patientOrder", query: { patientId: row.patientId } })
        },
        //时间格式转换
        formatDate(date) {
            if (date !== null) {
                const formattedDate = this.$moment(date, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY HH:mm');
                return formattedDate;
            } else {
                return 'None';
            }
        },
        //下医嘱---确认按钮
        submitPatientOrder() {
            console.log(this.patientOrderDTO)
            this.$axios.post("http://localhost/patientOrder/add", this.patientOrderDTO).then(resp => {
                if (resp.data.code == 200) {
                    this.$message.success("Success")
                    this.patientOrderDTO = {
                        treatment: {
                            treatmentId: '',
                            treatmentName: ''
                        }
                    };
                    this.orderDialogVisible = false;
                } else {
                    this.$message.warning(resp.data.data);
                }
            })
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.orderDialogVisible = true;
            this.patientOrderDTO = Object.assign({}, row, {
                treatment: {
                    treatmentId: '',
                    treatmentName: '',
                    treatmentCategory: '',
                    treatmentCount: ''
                },
                patient: {
                    patientId: row.patientId
                },
                dischargeDiagnosis: {

                }
            });
        },
        //查询医生科室
        getUnitByDoctor(val) {
            if (val) {
                let doctorId = this.patientInfoDTO.doctorId
                this.$axios.get("http://localhost/employee/getUnitByDid/" + doctorId).then(resp => {
                    if (resp.data.code == 200) {
                        this.patientInfoDTO.unitId = resp.data.data.unitId;
                    } else {
                        this.$message.warning(resp.data.data)
                    }
                })
            }
        },
        //查询某科室所有医生
        getDoctorsByUnitId() {
            let unit = {
                unitId: this.patientInfoDTO.unitId
            }
            this.$axios.post("http://localhost/employee/getEmployee/", unit).then(resp => {
                if (resp.data.code == 200) {
                    this.employees = resp.data.data
                    this.patientInfoDTO.doctorId = '';
                } else {
                    this.$message(resp.data.data)
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
            this.$axios.post("http://localhost/patientInfo/getByKeyWord", this.patientInfoDTO).then(resp => {
                if (resp.data.code === 200) {
                    console.log(resp.data.data)
                    this.patientInfos = resp.data.data.list;
                    this.total = resp.data.data.total;
                    this.$message.success("Success")
                } else {
                    this.$message.error("Search Failed")
                }
            })
        },
        //查询所有医生
        getAllDoctors() {
            this.patientInfoDTO.unitId = '',
                this.$axios.get("http://localhost/employee/getAllEmployee").then(resp => {
                    if (resp.data.code == 200) {
                        this.employees = resp.data.data
                    } else {
                        this.$message(resp.data.data)
                    }
                })
        },
        //查询所有科室
        getAllUnits() {
            this.$axios.get("http://localhost/unit/getAll").then(resp => {
                if (resp.data.code == 200) {
                    this.units = resp.data.data
                } else {
                    this.$message(resp.data.data)
                }
            })
        },
        //查询所有患者信息
        getAllPatientInfos() {
            //设置分页信息
            this.patientInfoDTO.pageNum = this.pageNum;
            this.patientInfoDTO.pageSize = this.pageSize;
            this.$axios.post("http://localhost/patientInfo/get/all", this.patientInfoDTO).then(resp => {
                if (resp.data.code == 200) {
                    this.patientInfos = resp.data.data.patientInfos;
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
            this.getAllPatientInfos()
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getAllPatientInfos();
        }
    },
    data() {
        return {
            patientInfos: [],
            patientInfoDTO: {
                unitId: '',
                doctorId: ''
            },
            //所有科室
            units: [],
            employees: [],
            pageNum: 1,
            pageSize: 10,
            total: null,
            orderDialogVisible: false,
            patientOrderDTO: {
                treatment: {
                    treatmentId: '',
                    treatmentName: '',
                    treatmentCategory: '',
                    treatmentCount: ''
                },
                dischargeDiagnosis: {
                    dischargeDiagnosisId: '',
                    dischargeDiagnosisName: ''
                }

            },
            treatments: [],
            administrations: [],
            dosages: [],
            dischargeDiagnoses: [],
        }
    },
    created() {
        this.getAllPatientInfos();
        this.getAllUnits();
        this.getAllDoctors();
        this.getAllAdministrations();
        this.getAllDosages();
        this.getAllDischargeDiagnosis();
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