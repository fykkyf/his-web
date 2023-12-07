<template>
  <div>

    <!-- 条件查询 住院检验-->
    <div>
      <el-form ref="form" :model="PatientLabDTO" label-width="100px">
        <el-col :span="4">
          <div>
            <h1 class="clinic-title">住院检验站</h1>
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="开始日期">
            <el-date-picker v-model="PatientLabDTO.testDate" type="date" value-format="yyyy-MM-dd" placeholder="检验日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="截止日期">
            <el-date-picker v-model="PatientLabDTO.testDate1" type="date" value-format="yyyy-MM-dd" placeholder="检验日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="住院号">
            <el-input v-model="PatientLabDTO.patientId" placeholder="住院号"></el-input>
          </el-form-item>
          <el-form-item label="检验状态">
            <el-radio v-model="PatientLabDTO.testStatus" label="1">未检验</el-radio>
            <el-radio v-model="PatientLabDTO.testStatus" label="2">已检验</el-radio>
            <el-radio v-model="PatientLabDTO.testStatus" label="null">不限</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getAllPatientLab">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <div>
      <el-table border :data="PatientLabVO" style="width: 100%">
        <el-table-column prop="patientLabId" label="检验编号" width="50" sortable>
        </el-table-column>
        <el-table-column prop="patientBillId" label="费用编号" width="50" sortable>
        </el-table-column>
        <el-table-column prop="patientId" label="住院号" width="90" sortable>
        </el-table-column>
        <el-table-column prop="patientName" label="姓名" width="90" sortable>
        </el-table-column>
        <el-table-column prop="unitName" label="科室名称" width="90" sortable>
        </el-table-column>
        <el-table-column prop="employeeName" label="医生" width="120" sortable>
        </el-table-column>
        <el-table-column prop="treatmentId" label="项目编号" width="70" sortable>
        </el-table-column>
        <el-table-column prop="treatmentName" label="检验项目" width="130" sortable>
        </el-table-column>

        <el-table-column prop="testDate" label="检验日期" width="100" sortable>
        </el-table-column>
        <el-table-column prop="labResult" label="检验结果" width="250" sortable>
        </el-table-column>

        <el-table-column prop="testStatus" label="检验状态" width="100" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 1" style="color:red">未检验</span>
            <span v-else-if="scope.row.testStatus === 2">已检验</span>
          </template>
        </el-table-column>


        <el-table-column label="基本信息操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" class="el-icon-upload"
              @click="to_updatePatientLab(scope.row)">结果录入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 结果录入弹出框 -->
    <div>
      <el-dialog title="检验结果" :visible.sync="toupdatePatientLab">
        <el-form ref="form" :model="PatientLabDTO1" label-width="100px">

          <el-form-item label="住院号" prop="patientId">
            <el-input v-model="PatientLabDTO1.patientId" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="patientName">
            <el-input v-model="PatientLabDTO1.patientName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="检验项目" prop="treatmentName">
            <el-input v-model="PatientLabDTO1.treatmentName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="检验结果" prop="labResult">
            <el-input v-model="PatientLabDTO1.labResult"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="success" @click="updateAllPatientLab" class="el-icon-upload2">上 传</el-button>

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