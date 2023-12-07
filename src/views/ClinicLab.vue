<template>
  <div>
    <!-- 条件查询 -->
    <div>
      <el-form ref="form" :model="ClinicLabDTO" label-width="100px">
        <el-col :span="4">
          <div>
            <h1 class="clinic-title">门诊检验站</h1>
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="ClinicLabDTO.testDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="检验日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="截止日期">
            <el-date-picker
              v-model="ClinicLabDTO.testDate1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="检验日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="就诊号">
            <el-input
              v-model="ClinicLabDTO.visitorId"
              placeholder="就诊号"
            ></el-input>
          </el-form-item>
          <el-form-item label="检验状态">
            <el-radio v-model="ClinicLabDTO.testStatus" label="1"
              >未检验</el-radio
            >
            <el-radio v-model="ClinicLabDTO.testStatus" label="2"
              >已检验</el-radio
            >
            <el-radio v-model="ClinicLabDTO.testStatus" label="null"
              >不限</el-radio
            >
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getAllClinicLab"
              >查询</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <div>
      <el-table border :data="ClinicLabVO" style="width: 100%">
        <el-table-column
          prop="clinicLabId"
          label="检验编号"
          width="50"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="visitorBillId"
          label="费用编号"
          width="50"
          sortable
        >
        </el-table-column>
        <el-table-column prop="visitorId" label="就诊号" width="90" sortable>
        </el-table-column>
        <el-table-column prop="visitorName" label="姓名" width="90" sortable>
        </el-table-column>
        <el-table-column prop="unitName" label="科室名称" width="90" sortable>
        </el-table-column>
        <el-table-column prop="employeeName" label="医生" width="120" sortable>
        </el-table-column>
        <el-table-column
          prop="treatmentId"
          label="项目编号"
          width="70"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="treatmentName"
          label="检验项目"
          width="130"
          sortable
        >
        </el-table-column>

        <el-table-column prop="testDate" label="检验日期" width="100" sortable>
        </el-table-column>
        <el-table-column prop="labResult" label="检验结果" width="250" sortable>
        </el-table-column>

        <el-table-column
          prop="testStatus"
          label="检验状态"
          width="100"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 1" style="color: red"
              >未检验</span
            >
            <span v-else-if="scope.row.testStatus === 2">已检验</span>
          </template>
        </el-table-column>

        <el-table-column label="基本信息操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              class="el-icon-upload"
              @click="to_updateClinicLab(scope.row)"
              >结果录入</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 结果录入弹出框 -->
    <div>
      <el-dialog title="检验结果" :visible.sync="toupdateClinicLab">
        <el-form ref="form" :model="ClinicLabDTO1" label-width="100px">
          <el-form-item label="就诊号" prop="visitorId">
            <el-input
              v-model="ClinicLabDTO1.visitorId"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="visitorName">
            <el-input
              v-model="ClinicLabDTO1.visitorName"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="检验项目" prop="treatmentName">
            <el-input
              v-model="ClinicLabDTO1.treatmentName"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="检验结果" prop="labResult">
            <el-input v-model="ClinicLabDTO1.labResult"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button
            type="success"
            @click="updateAllClinicLab"
            class="el-icon-upload2"
            >上 传</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toupdateClinicLab: false, //修改

      ClinicLabDTO: {}, //查询提交条件
      ClinicLabVO: [], //接收查询结果
      ClinicLabDTO1: {}, //结果上传
    };
  },
  created() {},
  methods: {
    to_updateClinicLab(obj) {
      this.ClinicLabDTO1 = obj;
      this.toupdateClinicLab = true;
    },

    //上传取消
    cancel() {
      this.ClinicLabDTO1 = {};
      this.toupdateClinicLab = false;
    },

    //上传结果确定
    updateAllClinicLab() {
      this.$axios
        .post(
          "http://localhost/clinicLab/updateAllClinicLab",
          this.ClinicLabDTO1
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.$message({
              message: resp.data.data,
              type: "success",
            });
            this.toupdateClinicLab = false;
            this.ClinicLabDTO1 = {};
            this.getAllClinicLab();
          } else {
          }
        });
    },
    //条件查询  查出所有项目
    getAllClinicLab() {
      this.$axios
        .post("http://localhost/clinicLab/getAllClinicLab", this.ClinicLabDTO)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.ClinicLabVO = resp.data.data;
          } else {
          }
        });
    },
  },
};
</script>

<style>
.clinic-title {
  text-align: center; /* 居中对齐 */
  font-size: 32px; /* 设置字体大小 */
  font-family: "艺术字体名称"; /* 设置艺术字体 */
  /* 其他样式... */
}
</style>