<template>
  <div>
    <el-table :data="orderData" stripe border>
      <el-table-column prop="visitorId" label="就诊号"> </el-table-column>
      <el-table-column prop="visitorName" label="病人姓名"> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="idNumber" label="身份证号"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="clinicDiagnosis.diseaseName" label="门诊诊断">
      </el-table-column>
      <el-table-column prop="clinicStartTime" label="就诊时间">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="warning"
            style="font-size: 15px"
            @click="handleEdit(scope.$index, scope.row)"
          >
            查看医嘱
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="show" title="医嘱信息">
      <el-table :data="tableData">
        <el-table-column prop="clinicOrderId" label="医嘱号"></el-table-column>
        <el-table-column
          prop="treatmentName"
          label="项目名称"
        ></el-table-column>
        <el-table-column prop="administrationName" label="用法" width="120px">
          <template slot-scope="scope">
            {{
              scope.row.administrationName !== null
                ? scope.row.administrationName
                : "暂无信息"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="dosageName" label="用量" width="120px">
          <template slot-scope="scope">
            {{ scope.row.dosageName !== null ? scope.row.dosageName : "暂无信息" }}
          </template>
        </el-table-column>
        <el-table-column prop="treatmentCount" label="个数" width="120px">
          <template slot-scope="scope">
            {{
              scope.row.treatmentCount !== null
                ? scope.row.treatmentCount
                : "暂无信息"
            }}
          </template>
        </el-table-column>

        <el-table-column prop="executionTime" label="执行时间" width="120px">
          <template slot-scope="scope">
            {{
              scope.row.executionTime !== null
                ? scope.row.executionTime
                : "暂无信息"
            }}
          </template>
        </el-table-column>


        <!-- <el-table-column prop="dispenseTime" label="发药时间" width="120px">
          <template slot-scope="scope">
            {{
              scope.row.dispenseTime !== null
                ? scope.row.dispenseTime
                : "暂无信息"
            }}
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderData: [],
      tableData: [],
      show: false,
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$axios
        .post(
          "http://localhost/clinicOrder/getOrderByVisitorId?visitorId=" +
            row.visitorId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.show=true;
          }
        });
    },
    getVisitorsByClinicStatus() {
      this.$axios
        .get("http://localhost/visitorInfo/getCheckOver")
        .then((res) => {
          if (res.data.code == 200) {
            this.orderData = res.data.data;
          }
        });
    },
  },
  created() {
    this.getVisitorsByClinicStatus();
  },
};
</script>

<style>
</style>