<template>
    <div>
        <div>
            <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="6">
                        <el-form-item label="患者姓名">
                            <el-input placeholder="请输入内容" v-model="patientInfoDTO.patientName" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="患者性别">
                            <el-radio-group v-model="patientInfoDTO.gender">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                                <el-radio :label="''">不限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="科室">
                            <el-select v-model="patientInfoDTO.unitId" clearable placeholder="请选择科室"
                                @change="getDoctorsByUnitId">
                                <el-option v-for="item in units" :key="item.unitId" :label="item.unitName"
                                    :value="item.unitId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医生">
                            <el-select v-model="patientInfoDTO.employeeId" clearable placeholder="请选择医生"
                                @clear="getAllDoctors" @change="getUnitByDoctor">
                                <el-option v-for="item in employees" :key="item.employeeId" :label="item.employeeName"
                                    :value="item.employeeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="入院状态">
                            <el-radio-group v-model="patientInfoDTO.stayStatus">
                                <el-radio :label="1">未出院</el-radio>
                                <el-radio :label="2">已出院</el-radio>
                                <el-radio :label="''">不限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="结算状态">
                            <el-radio-group v-model="patientInfoDTO.paymentStatus">
                                <el-radio :label="1">未结束</el-radio>
                                <el-radio :label="2">已结算</el-radio>
                                <el-radio :label="''">不限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button icon="el-icon-search" round @click="getByKeyword"></el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <template>
                <el-table :data="patientInfos" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="patientId" label="患者编号" width="80px">
                        <template slot-scope="scope">
                            {{ scope.row.patientId !== null ? scope.row.patientId : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="visitorId" label="门诊编号" width="80px">
                        <template slot-scope="scope">
                            {{ scope.row.visitorId !== null ? scope.row.visitorId : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="patientName" label="患者姓名">
                        <template slot-scope="scope">
                            {{ scope.row.patientName !== null ? scope.row.patientName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                        <template slot-scope="scope">
                            {{ scope.row.gender === 1 ? '男' : '女' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="age" label="年龄">
                        <template slot-scope="scope">
                            {{ scope.row.age !== null ? scope.row.age : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="科室">
                        <template slot-scope="scope">
                            {{ scope.row.unit !== null ? scope.row.unit.unitName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="employee" label="医生">
                        <template slot-scope="scope">
                            {{ scope.row.employee !== null ? scope.row.employee.employeeName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuranceStatus" label="医保"
                        :filters="[{ text: '无', value: '1' }, { text: '有', value: '2' }]" :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.insuranceStatus === 1 ? 'primary' : 'success'" disable-transitions>{{
                                scope.row.insuranceStatus === 2 ? '有' : '无' }}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="insuranceStatus" label="医保">
                        <template slot-scope="scope">
                            {{ scope.row.insuranceStatus === 2 ? '有' : '无' }}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="inTime" label="入院时间">
                        <template slot-scope="scope">
                            {{ scope.row.inTime !== null ? formatDate(scope.row.inTime) : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="outTime" label="出院时间">
                        <template slot-scope="scope">
                            {{ scope.row.outTime !== null ? formatDate(scope.row.outTime) : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="诊断">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>门诊诊断: {{ scope.row.clinicDiagnosis !== null ? scope.row.clinicDiagnosis.diseaseName :
                                    "暂无信息" }}</p>
                                <p>入院诊断: {{ scope.row.admissionDiagnosis !== null ? scope.row.admissionDiagnosis.diseaseName
                                    : "暂无信息" }}</p>
                                <p>出院诊断: {{ scope.row.dischargeDiagnosis !== null ? scope.row.dischargeDiagnosis.diseaseName
                                    : "暂无信息" }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" type="danger">诊断信息</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="三测">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                                <p>血压: {{ scope.row.regularResult !== null ? scope.row.regularResult.pressure :
                                    "暂无信息" }}</p>
                                <p>血糖: {{ scope.row.regularResult !== null ? scope.row.regularResult.sugar
                                    : "暂无信息" }}</p>
                                <p>体温: {{ scope.row.regularResult !== null ? scope.row.regularResult.temp
                                    : "暂无信息" }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" type="success">三测信息</el-tag>
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
                    <el-table-column prop="location" label="床位号">
                        <template slot-scope="scope">
                            {{ scope.row.location !== null ? scope.row.location.locationName : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="paidTime" label="支付时间">
                        <template slot-scope="scope">
                            {{ scope.row.paidTime !== null ? formatDate(scope.row.paidTime) : "暂无信息" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stayStatus" label="入院状态">
                        <template slot-scope="scope">
                            {{ scope.row.stayStatus === 1 ? "未出院" : "已出院" }}
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
        //时间格式转换
        formatDate(date) {
            if (date !== null) {
                const formattedDate = this.$moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日 HH:mm:ss');
                return formattedDate;
            } else {
                return '暂无信息';
            }
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.orderDialogVisible = true;
            this.patientOrder = Object.assign({}, row, {
                treatment: {}
            });

        },
        //查询医生科室
        getUnitByDoctor(val) {
            if (val) {
                let doctorId = this.patientInfoDTO.employeeId
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
                treatmentCategory: this.patientOrder.treatment.treatmentCategory,
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
                    this.$message.success("查询成功")
                } else {
                    this.$message.error("查询失败")
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
                    console.log(resp.data)
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
            patientOrder: {
                treatment: {
                }
            },
            treatments: [],
            administrations: [],
            dosages: [],

        }
    },
    created() {
        this.getAllPatientInfos();
        this.getAllUnits();
        this.getAllDoctors();
        this.getAllAdministrations();
        this.getAllDosages();
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