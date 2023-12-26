<template>
  <div>
    <div style="margin-top: 50px;">
      <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="Name" label-width="150px">
              <el-input placeholder="Patient Name" v-model="patientInfoDTO.patientName" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="DL" label-width="150px">
              <el-input placeholder="Driver's License ID" v-model="patientInfoDTO.idNumber" style="width: 300px;"
                @blur="getInfoByIdNumber()"></el-input>
            </el-form-item>

            <el-form-item label="Age" label-width="150px">
              <el-input placeholder="Patient Age" v-model="patientInfoDTO.age" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="Gender" label-width="150px">
              <el-radio-group v-model="patientInfoDTO.gender" style="width: 300px;">
                <el-radio :label="1">Male</el-radio>
                <el-radio :label="2">Female</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Visitor ID" label-width="150px">
              <el-select v-model="patientInfoDTO.visitorId" placeholder="Previous Visit Number" style="width: 300px;"
                @change="getClinicDiagnoses()">
                <el-option v-for="item in visitors" :key="item" :label="item + ' '" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Previous Diagnosis" label-width="150px">
              <el-input placeholder="" v-model="patientInfoDTO.clinicDiagnosisName" disabled
                style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="Admission Diagnosis" label-width="150px">
              <el-select v-model="patientInfoDTO.admissionDiagnosisId" placeholder="" style="width: 300px;"
                @change="getDoctorsByUnitId">
                <el-option v-for="item in admissionDiagnoses" :key="item.diseaseId" :label="item.diseaseName" :value="item.diseaseId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Unit" label-width="150px">
              <el-select v-model="patientInfoDTO.unitId" placeholder="" style="width: 300px;"
                @change="getDoctorsByUnitId">
                <el-option v-for="item in units" :key="item.unitId" :label="item.unitName" :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Physician" label-width="150px">
              <el-select v-model="patientInfoDTO.employeeId" placeholder="" style="width: 300px;">
                <el-option v-for="item in employees" :key="item.employeeId" :label="item.employeeName"
                  :value="item.employeeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.patientInfoDTO = {}">Cancel</el-button>
        <el-button type="primary" @click="submitPatientInfo()">Submit</el-button>
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