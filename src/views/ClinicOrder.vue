<template>
  <div>
    <el-form ref="form" :model="visitorInfo">
      <el-row>
        <el-form-item label="姓名">
          <el-input
            v-model="visitorInfo.visitorName"
            placeholder="请输入名字"
            @input="getByCondition"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input
            v-model="visitorInfo.idNumber"
            placeholder="请输入身份证号"
            @input="getByCondition"
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <el-button @click="showDialog">挂号</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="visitorId" label="就诊号"> </el-table-column>
      <el-table-column prop="visitorName" label="病人姓名"> </el-table-column>
      <el-table-column prop="gender" label="性别"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="idNumber" label="身份证号"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="unit.unitName" label="就诊科室"> </el-table-column>
      <el-table-column prop="employee.employeeName" label="就诊医生">
      </el-table-column>
      <el-table-column prop="clinicDiagnosis.diseaseName" label="门诊诊断">
      </el-table-column>
      <el-table-column prop="clinicStartTime" label="就诊时间">
      </el-table-column>
      <el-table-column prop="clinicStatus" label="状态"> </el-table-column>
      <el-table-column label="修改">
        <template slot-scope="scope">
          <el-button size="mini" @click="toupdate(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--挂号的对话框-->
    <el-dialog :title="myTitle" :visible.sync="show">
      <el-form
        ref="visitor"
        :model="visitor"
        label-width="80px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="visitorName">
          <el-input v-model="visitor.visitorName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="visitor.gender" label="1">男</el-radio>
          <el-radio v-model="visitor.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="visitor.age"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="visitor.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="visitor.phone"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-select
            v-model="visitor.unit.unitId"
            clearable
            placeholder="请选择就诊科室"
            @change="selDep"
          >
            <el-option
              v-for="unit in units"
              :key="unit.unitId"
              :value="unit.unitId"
              :label="unit.unitName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生">
          <el-select
            v-model="visitor.employee.employeeId"
            clearable
            placeholder="请选择医生"
          >
            <el-option
              v-for="doc in employees"
              :key="doc.employeeId"
              :value="doc.employeeId"
              :label="doc.employeeName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit('visitor')"
          :disabled="isDisabled"
          >确 定</el-button
        >
        <el-button type="primary" :disabled="isDisableds" @click="pay"
          >点击付款</el-button
        >
        <el-button @click="closeDialog" :disabled="isDisabledss"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <!--修改的对话框-->
    <el-dialog :title="myTitle" :visible.sync="shows">
      <el-form
        ref="visitor"
        :model="visitor"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="就诊号" prop="visitorId">
          <el-input v-model="visitor.visitorId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="visitorName">
          <el-input v-model="visitor.visitorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-select
            v-model="visitor.unit.unitId"
            clearable
            placeholder="请选择就诊科室"
            @change="selDep"
          >
            <el-option
              v-for="unit in units"
              :key="unit.unitId"
              :value="unit.unitId"
              :label="unit.unitName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生">
          <el-select
            v-model="visitor.employee.employeeId"
            clearable
            placeholder="请选择医生"
          >
            <el-option
              v-for="doc in employees"
              :key="doc.employeeId"
              :value="doc.employeeId"
              :label="doc.employeeName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitUpdate()">确 定</el-button>
        <el-button @click="closeDialogs">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shows: false,
      isDisabledss: false,
      isDisabled: false,
      isDisableds: true,
      myTitle: "",
      // visitorUpdate:{

      // },
      visitorInfo: {
        // unitId:null,
        // doctorId:null
        gender: null,
      },
      visitor: { unit: {}, employee: {} },
      unit: {
        unitId: "",
      },
      show: false,
      tableData: [],
      units: [],
      employees: [],
      rules: {
        visitorName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        idNumber: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            min: 9,
            max: 9,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        unit: [
          {
            type: "array",
            required: true,
            message: "请选择一个部门",
            trigger: "change",
          },
        ],
        employee: [
          {
            type: "array",
            required: true,
            message: "请选择一个医生",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    onSubmitUpdate() {
      console.log("这里是visitorId:" + this.visitor.visitorId);
      console.log("这里是unitId:" + this.visitor.unit.unitId);
      console.log("这里是employeeId:" + this.visitor.employee.employeeId);
      this.$axios
        .post(
          "http://localhost/visitorInfo/updateDoc?visitorId=" +
            this.visitor.visitorId +
            "&unitId=" +
            this.visitor.unit.unitId +
            "&employeeId=" +
            this.visitor.employee.employeeId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.shows = false;
            this.visitor = {};
          }
        });
    },
    pay() {
      this.show = false;
      this.$axios
        .post("http://localhost/visitorBill/getPrice", this.visitor)
        .then((res) => {
          if (res.data.code == 200) {
            let price = res.data.data;
            this.$axios
              .post("http://localhost/visitorInfo/add", this.visitor)
              .then((resp) => {
                if (resp.data.code == 200) {
                  this.tableData.push(resp.data.data);
                  this.$message({
                    message: "挂号成功,已付款:" + price + "元",
                    type: "success",
                  });
                  // this.show = false; // 这行代码现在应该可以工作
                  // this.isDisabledss = false;
                  // this.isDisabled = false;
                  // this.isDisableds = true;
                  // this.visitor = {};
                }
              });
          }
          this.show = false; // 这行代码现在应该可以工作
          this.isDisabledss = false;
          this.isDisabled = false;
          this.isDisableds = true;
          this.visitor = {};
        });
    },
    // pay() {
    //   this.$axios
    //     .post("http://localhost/visitorBill/getPrice", this.visitor)
    //     .then((res) => {
    //       if (res.data.code == 200) {
    //         let price = res.data.data;
    //         alert("请支付：" + price + "元");
    //         this.$axios
    //           .post("http://localhost/visitorInfo/add", this.visitor)
    //           .then((resp) => {
    //             if (resp.data.code == 200) {
    //               this.tableData.push(resp.data.data);
    //               this.$message({
    //                 message: "挂号成功",
    //                 type: "success",
    //               });
    //               this.show = false;
    //               this.isDisabledss = false;
    //               this.isDisabled = false;
    //               this.isDisableds = true;
    //               this.visitor={}
    //             }
    //           });
    //       }
    //     });
    // },
    closeDialogs() {
      this.visitor = { unit: {}, employee: {} };
      this.shows = false;
    },
    toupdate(row) {
      this.visitor = { ...row };
      // this.visitor.gender=row.gender
      this.shows = true;
      this.myTitle = "修改信息";
    },
    closeDialog() {
      this.visitor = { unit: {}, employee: {} };
      this.show = false;
      this.$refs.visitor.resetFields();
    },
    onSubmit(visitor) {
      this.$refs[visitor].validate((valid) => {
        if (valid) {
          this.$message({
            message: "请支付",
            type: "warning",
          });
          this.isDisabled = true;
          this.isDisableds = false;
          this.isDisabledss = true;
        }
      });
    },
    getByCondition() {
      this.$axios
        .post("http://localhost/visitorInfo/getByWaitCheck", this.visitorInfo)
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.tableData.forEach((item) => {
              if (item.gender == 1) {
                item.gender = "男";
              } else if (item.gender == 2) {
                item.gender = "女";
              }
              if (item.clinicStatus == 1) {
                item.clinicStatus = "候诊";
              } else if (item.clinicStatus == 2) {
                item.clinicStatus = "就诊";
              } else {
                item.clinicStatus = "过诊";
              }
            });
          }
        });
    },
    showDialog() {
      this.show = true;
      this.myTitle = "添加信息";
    },
    getAllUnits() {
      this.$axios.get("http://localhost/unit/getAll").then((res) => {
        if (res.data.code == 200) {
          this.units = res.data.data;
        }
      });
    },
    selDep() {
      this.unit.unitId = this.visitor.unit.unitId;
      this.$axios
        .post("http://localhost/employee/getEmployee", this.unit)
        .then((res) => {
          if (res.data.code == 200) {
            this.employees = res.data.data;
          }
          // this.show = false;
          // this.tableData = {};
        });
    },
  },
  created() {
    this.getAllUnits();
    this.getByCondition();
  },
};
</script>

<style>
</style>