<template>
  <div>

    <!-- 条件查询 住院检验-->
    <div>
      <el-form ref="form" :model="PatientLabDTO" label-width="100px">
        <el-col :span="4">
          <div>
            <h1 class="clinic-title">Laboratory Station</h1>
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Start Time">
            <el-date-picker v-model="PatientLabDTO.testDate" type="date" value-format="yyyy-MM-dd" placeholder="">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="End time">
            <el-date-picker v-model="PatientLabDTO.testDate1" type="date" value-format="yyyy-MM-dd" placeholder="">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="Patient ID">
            <el-input v-model="PatientLabDTO.patientId" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Status">
            <el-radio v-model="PatientLabDTO.testStatus" label="1">Pending</el-radio>
            <el-radio v-model="PatientLabDTO.testStatus" label="2">Finished</el-radio>
            <el-radio v-model="PatientLabDTO.testStatus" label="null">All</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getAllPatientLab">Search</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <div>
      <el-table border :data="PatientLabVO" style="width: 100%">
        <el-table-column prop="patientLabId" label="ID" width="70" sortable>
        </el-table-column>
        <el-table-column prop="patientBillId" label="Order #" width="80" >
        </el-table-column>
        <el-table-column prop="patientId" label="Patient #" width="90" >
        </el-table-column>
        <el-table-column prop="patientName" label="Name" width="120" >
        </el-table-column>
        <el-table-column prop="unitName" label="Unit" width="120" >
        </el-table-column>
        <el-table-column prop="employeeName" label="Physician" width="120" >
        </el-table-column>
<!--        <el-table-column prop="treatmentId" label="Treatment #" width="110" >-->
<!--        </el-table-column>-->
        <el-table-column prop="treatmentName" label="Treatment" width="130" sortable>
        </el-table-column>

        <el-table-column prop="testDate" label="Test Date" width="120" sortable>
        </el-table-column>
        <el-table-column prop="labResult" label="Test Result" width="250" sortable>
        </el-table-column>

        <el-table-column prop="testStatus" label="Status" width="100" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 1" style="color:red">Pending</span>
            <span v-else-if="scope.row.testStatus === 2">Finished</span>
          </template>
        </el-table-column>


        <el-table-column label="Operations">
          <template slot-scope="scope">
            <el-button type="success" size="small" class="el-icon-upload"
              @click="to_updatePatientLab(scope.row)">Fill Result</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 结果录入弹出框 -->
    <div>
      <el-dialog title="Test Result" :visible.sync="toupdatePatientLab">
        <el-form ref="form" :model="PatientLabDTO1" label-width="100px">

          <el-form-item label="Patient #" prop="patientId">
            <el-input v-model="PatientLabDTO1.patientId" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="Name" prop="patientName">
            <el-input v-model="PatientLabDTO1.patientName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="Treatment" prop="treatmentName">
            <el-input v-model="PatientLabDTO1.treatmentName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="Result" prop="labResult">
            <el-input v-model="PatientLabDTO1.labResult"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">Cancel</el-button>
          <el-button type="success" @click="updateAllPatientLab" class="el-icon-upload2">Submit</el-button>

        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {

      toupdatePatientLab: false,//修改

      PatientLabDTO: {},//查询提交条件
      PatientLabVO: [],//接收查询结果
      PatientLabDTO1: {},//结果上传


    };
  },
  created() { },
  methods: {
    to_updatePatientLab(obj) {
      this.PatientLabDTO1 = obj;
      this.toupdatePatientLab = true;
    },

    //上传取消
    cancel() {
      this.PatientLabDTO1 = {};
      this.toupdatePatientLab = false;
    },

    //上传结果确定
    updateAllPatientLab() {
      this.$axios
        .post(
          "http://localhost/patientLab/updateAllPatientLab", this.PatientLabDTO1)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.$message({
              message: resp.data.data,
              type: 'success'
            })
            this.toupdatePatientLab = false;
            this.PatientLabDTO1 = {};
            this.getAllPatientLab();
          } else {
          }
        });
    },
    //条件查询  查出所有项目
    getAllPatientLab() {
      this.$axios
        .post(
          "http://localhost/patientLab/getAllPatientLab",
          this.PatientLabDTO
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.PatientLabVO = resp.data.data;
          } else {
          }
        });
    },


  },
}
</script>

<style></style>