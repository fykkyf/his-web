<template>


  <div>
    <div>
      <el-form ref="patientInfoDTO" :model="patientInfoDTO" label-width="80px">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-form-item label="Name :">
              <el-input placeholder="" v-model="patientInfoDTO.patientName" clearable></el-input>
            </el-form-item>

            <el-form-item label="Gender :">
              <el-radio-group v-model="patientInfoDTO.gender">
                <el-radio :label="1">Male</el-radio>
                <el-radio :label="2">Female</el-radio>
                <el-radio :label="''">No limit</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Unit">
              <el-select v-model="patientInfoDTO.unitId" clearable placeholder=""
                         @change="getDoctorsByUnitId">
                <el-option v-for="item in units" :key="item.unitId" :label="item.unitName"
                           :value="item.unitId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Physician">
              <el-select v-model="patientInfoDTO.employeeId" clearable placeholder=""
                         @clear="getAllDoctors" @change="getUnitByDoctor">
                <el-option v-for="item in employees" :key="item.employeeId" :label="item.employeeName"
                           :value="item.employeeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Status :">
              <el-radio-group v-model="patientInfoDTO.stayStatus">
                <el-radio :label="1">Still In</el-radio>
                <el-radio :label="2">Discharge</el-radio>
                <el-radio :label="''">No Limit</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Payment :">
              <el-radio-group v-model="patientInfoDTO.paymentStatus">
                <el-radio :label="1">Unpaid</el-radio>
                <el-radio :label="2">Paid</el-radio>
                <el-radio :label="''">No Limit</el-radio>
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
          <el-table-column prop="patientId" label="PID" width="70px">
            <template slot-scope="scope">
              {{ scope.row.patientId !== null ? scope.row.patientId : "None" }}
            </template>
          </el-table-column>
          <el-table-column prop="visitorId" label="VID" width="70px">
            <template slot-scope="scope">
              {{ scope.row.visitorId !== null ? scope.row.visitorId : "None" }}
            </template>
          </el-table-column>
          <el-table-column prop="patientName" label="Name" width="130px">
            <template slot-scope="scope">
              {{ scope.row.patientName !== null ? scope.row.patientName : "None" }}
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="Gender" width="80px">
            <template slot-scope="scope">
              {{ scope.row.gender === 1 ? 'Male' : 'Female' }}
            </template>
          </el-table-column>
          <el-table-column prop="age" label="Age" width="80px">
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
          <el-table-column prop="insuranceStatus" label="Insurance"
                           :filters="[{ text: 'No', value: '1' }, { text: 'Yes', value: '2' }]" :filter-method="filterTag"
                           filter-placement="bottom-end" width="100px">
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
          <el-table-column label="Diagnosis" width="130px">
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
          <el-table-column label="Operations" width="130px">

              <template slot-scope="scope">
                <el-button size="mini" @click="editDialog(scope.row)" type="success">Vital Signs</el-button>

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
    <div>
      <el-dialog title="Today's Vital Signs" :visible.sync="show" width="80%" center>
        <el-form ref="regularTest" :model="regularTest" label-width="80px">
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label="Patient ID" label-width="110px"  >
                <el-input placeholder="" v-model="regularTest.patientId" style="width: 300px;" disabled></el-input>
              </el-form-item>
              <el-form-item label="Blood Pressure" label-width="110px">
                <el-input placeholder="" v-model="regularTest.pressure" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="Blood Sugar" label-width="110px">
                <el-input placeholder="" v-model="regularTest.sugar" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="Temperature" label-width="110px">
                <el-input placeholder="" v-model="regularTest.temp" style="width: 300px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitRegularTest()">Submit</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.getAllPatientInfos();
    this.getAllUnits();
    this.getAllDoctors();
    this.getAllAdministrations();
    this.getAllDosages();
  },
  data() {

    return {
      regularTest:{
        patientId:'',
        pressure:'',
        sugar:'',
        temp:'',
      },
      show: false,
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
  methods: {
    submitRegularTest() {
      this.$axios.post("http://localhost/regular/post", this.regularTest)
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: "Success",
                type: "success",
              });
            }
          })
      this.show = false;
      this.regularTest={};
    },
    closeDialog() {
      this.show = false;
      this.regularTest = {};
    },
    editDialog(row){
      console.log(row.patientId);
      this.regularTest.patientId = row.patientId;
      this.show=true;
    },
      //时间格式转换
      formatDate(date) {
        if (date !== null) {
          const formattedDate = this.$moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY/MM/DD HH:mm');
          return formattedDate;
        } else {
          return 'None';
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
            this.$message.success("Success")
          } else {
            this.$message.error("Failed")
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
