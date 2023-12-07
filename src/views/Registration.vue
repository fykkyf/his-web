<template>
  <div>
    <div style="margin-top: 50px;">
      <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="患者身份证号" label-width="100px">
              <el-input placeholder="请输入患者身份证号" v-model="patientInfoDTO.idNumber" style="width: 300px;"
                @blur="getInfoByIdNumber()"></el-input>
            </el-form-item>
            <el-form-item label="患者姓名" label-width="100px">
              <el-input placeholder="请输入患者姓名" v-model="patientInfoDTO.patientName" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="患者年龄" label-width="100px">
              <el-input placeholder="请输入患者年龄" v-model="patientInfoDTO.age" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="患者性别" label-width="100px">
              <el-radio-group v-model="patientInfoDTO.gender" style="width: 300px;">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="门诊就诊编号" label-width="100px">
              <el-select v-model="patientInfoDTO.visitorId" placeholder="请选择门诊就诊编号" style="width: 300px;"
                @change="getClinicDiagnoses()">
                <el-option v-for="item in visitors" :key="item" :label="item + '号就诊号'" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门诊诊断" label-width="100px">
              <el-input placeholder="请选择门诊就诊编号" v-model="patientInfoDTO.clinicDiagnosisName" disabled
                style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="入院诊断" label-width="100px">
              <el-select v-model="patientInfoDTO.admissionDiagnosisId" placeholder="请选择入院诊断" style="width: 300px;"
                @change="getDoctorsByUnitId">
                <el-option v-for="item in admissionDiagnoses" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科室" label-width="100px">
              <el-select v-model="patientInfoDTO.unitId" placeholder="请选择科室" style="width: 300px;"
                @change="getDoctorsByUnitId">
                <el-option v-for="item in units" :key="item.unitId" :label="item.unitName" :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医生" label-width="100px">
              <el-select v-model="patientInfoDTO.employeeId" placeholder="请选择医生" style="width: 300px;">
                <el-option v-for="item in employees" :key="item.employeeId" :label="item.employeeName"
                  :value="item.employeeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.patientInfoDTO = {}">取 消</el-button>
        <el-button type="primary" @click="submitPatientInfo()">确 定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      patientInfoDTO: {},
      units: [],
      employees: [],
      clinicDiagnoses: [],
      visitors: [],
      admissionDiagnoses:[],
    }
  },
  created() {
    this.getAllUnits();
    this.getAllAdmissionDiagnoses();
  },
  methods: {
    //查询所有疾病
    getAllAdmissionDiagnoses() {
            this.$axios.get("http://localhost/disease/get/all").then(resp => {
                if (resp.data.code == 200) {
                    this.admissionDiagnoses = resp.data.data
                } else {
                    this.$message.warning(resp.data.data)
                }
            })

        },
    //添加病人信息
    submitPatientInfo() {
      console.log(this.patientInfoDTO)
      this.$axios.post("http://localhost/patientInfo/add",this.patientInfoDTO).then(resp=>{
        if(resp.data.code==200){
          this.$message.success(resp.data.data)
        }else{
          this.$message.warning(resp.data.data)
        }
        this.patientInfoDTO={}
      })
    },
    //查询所有医生
    getDoctorsByUnitId() {
      let unit = {
        unitId: this.patientInfoDTO.unitId
      }
      this.$axios.post("http://localhost/employee/getEmployee/", unit).then(resp => {
        if (resp.data.code == 200) {
          this.employees = resp.data.data;
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
    //根据就诊号查询门诊疾病
    getClinicDiagnoses() {
      let visitorId = this.patientInfoDTO.visitorId
      this.$axios.get("http://localhost/patientInfo/get/clinicDiagnosis/" + visitorId).then(resp => {
        if (resp.data.code == 200) {
          this.patientInfoDTO.clinicDiagnosisId = resp.data.data.diseaseId;
          this.patientInfoDTO.clinicDiagnosisName = resp.data.data.diseaseName;

        } else {
          this.$message.warning(resp.data.data)
        }
      })
    },
    //根据身份证查询患者信息
    getInfoByIdNumber() {
      this.$axios.post("http://localhost/patientInfo/get/visitorInfo", this.patientInfoDTO).then(resp => {
        if (resp.data.code == 200) {
          if (resp.data.data.patientName!=null) {
            this.visitors = resp.data.data.visitors;
            this.patientInfoDTO = {
              idNumber: resp.data.data.idNumber,
              patientName: resp.data.data.patientName,
              gender: resp.data.data.gender,
              age: resp.data.data.age,
              clinicDiagnosisName: '',
              clinicDiagnosisId: '',
              employeeId: ''
            }
          }
        }
      })
    }
  }

}
</script>

<style></style>