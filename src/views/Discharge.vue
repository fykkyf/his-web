<template>
    <div>
        <div>
<!--            <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">-->
<!--                <el-row type="flex" class="row-bg" justify="space-around">-->
<!--                    <el-col :span="4" >-->
<!--                        <el-form-item label="住院编号:">-->
<!--                            <el-input placeholder="请输入住院编号" v-model="patientInfoDTO.patientId" clearable></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
<!--                  <el-col :span="4">-->
<!--                  </el-col>-->
<!--                    <el-col :span="2">-->
<!--                        <el-button type="success" icon="el-icon-search" @click="getAllPatientInfos">查询患者出院医嘱</el-button>-->
<!--                    </el-col>-->
<!--                </el-row>-->
<!--            </el-form>-->
          <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
            <el-row type="flex" class="row-bg" justify="start"> <!-- 使用 justify="start" 将左侧对齐 -->
              <el-col :span="4">
                <el-form-item label="Patient ID:">
                  <el-input placeholder="Enter here" v-model="patientInfoDTO.patientId" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16"></el-col> <!-- 占位，你可以根据实际需要调整占位的宽度 -->
              <el-col :span="4">
                <el-button type="success" icon="el-icon-search" @click="getAllPatientInfos">Search</el-button>
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
<!--                            {{ scope.row.visitorId !== null ? scope.row.visitorId : "None" }}-->
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
<!--                    <el-table-column prop="insuranceStatus" label="Ins"-->
<!--                        :filters="[{ text: 'No', value: '1' }, { text: 'Yes', value: '2' }]" :filter-method="filterTag"-->
<!--                        filter-placement="bottom-end">-->
<!--                        <template slot-scope="scope">-->
<!--                            <el-tag :type="scope.row.insuranceStatus === 1 ? 'primary' : 'success'" disable-transitions>{{-->
<!--                                scope.row.insuranceStatus === 2 ? '有' : '无' }}</el-tag>-->
<!--                        </template>-->
<!--                    </el-table-column>-->
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
                    <el-table-column prop="inTime" label="AT" width="100px">
                        <template slot-scope="scope">
                            {{ scope.row.inTime !== null ? scope.row.inTime : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="clinicDiagnosis" label="Prev Diagnosis" >
                        <template slot-scope="scope">
                            {{ scope.row.clinicDiagnosis !== null ? scope.row.clinicDiagnosis.diseaseName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="admissionDiagnosis" label="AD Diagnosis" >
                        <template slot-scope="scope">
                            {{ scope.row.admissionDiagnosis !== null ? scope.row.admissionDiagnosis.diseaseName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="dischargeDiagnosis" label="DC Diagnosis" >
                        <template slot-scope="scope">
                            {{ scope.row.dischargeDiagnosis !== null ? scope.row.dischargeDiagnosis.diseaseName : "None" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stayStatus" label="Status" >
                        <template slot-scope="scope">
                            {{ scope.row.stayStatus === 1 ? "Still In" : "DC" }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Operations">
                        <template slot-scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                                :disabled="scope.row.stayStatus != 1">Discharge</el-button>
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
        filterTag(value, row) {
            return row.tag === value;
        },
        handleEdit(index, row) {
            this.$axios.post("http://localhost/patientInfo/completeDischarge",row).then(resp=>{
                if(resp.data.code==200){
                    this.$message.success(resp.data.data)
                    this.getAllPatientInfos();
                }else{
                    this.$message.warning(resp.data.data)
                }
            })
        },
        //查询所有患者信息---出院诊断
        getAllPatientInfos() {
            //设置分页信息
          console.log(this.patientInfoDTO.patientId)
            this.patientInfoDTO.pageNum = this.pageNum;
            this.patientInfoDTO.pageSize = this.pageSize;
            this.$axios.post("http://localhost/patientInfo/get/allDischarge", this.patientInfoDTO).then(resp => {
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
            pageNum: 1,
            pageSize: 10,
            total: null,
        }
    },
    mounted() {
        this.getAllPatientInfos();
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