<template>
  <div>
    <el-form ref="form" :model="visitorInfo">
      <el-row type="flex" class="row-bg" justify="space-around" align="left">
        <el-col :span="2">
          <el-button type="primary" @click="showDialog">Check In</el-button>
        </el-col>
        <el-col :span="6">
        <el-form-item label="Name">
          <el-input
            v-model="visitorInfo.visitorName"
            placeholder=""
            @input="getByCondition"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item label="DL #">
          <el-input
            v-model="visitorInfo.idNumber"
            placeholder="Driver's License"
            @input="getByCondition"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="6">
        </el-col>
      </el-row>
    </el-form>



    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="visitorId" label="ID" width="50px"> </el-table-column>
      <el-table-column prop="visitorName" label="Name"> </el-table-column>
      <el-table-column prop="gender" label="Gender" width="80px"> </el-table-column>
      <el-table-column prop="age" label="Age" width="80px"> </el-table-column>
      <el-table-column prop="idNumber" label="DL#" width="110px"> </el-table-column>
      <el-table-column prop="phone" label="Phone#" width="110px"> </el-table-column>
      <el-table-column prop="unit.unitName" label="Unit"> </el-table-column>
      <el-table-column prop="employee.employeeName" label="Physician">
      </el-table-column>
      <el-table-column prop="clinicDiagnosis.diseaseName" label="Diagnosis" width="180px">
      </el-table-column>
      <el-table-column prop="clinicStartTime" label="ADT" width="120px">
      </el-table-column>
      <el-table-column prop="clinicStatus" label="Status"> </el-table-column>
      <el-table-column label="Operations">
        <template slot-scope="scope">
          <el-button size="mini" @click="toupdate(scope.row)">Edit Profile</el-button>
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
        <el-form-item label="Name" prop="visitorName">
          <el-input v-model="visitor.visitorName"></el-input>
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-radio v-model="visitor.gender" label="1">Male</el-radio>
          <el-radio v-model="visitor.gender" label="2">Female</el-radio>
        </el-form-item>
        <el-form-item label="Age" prop="age">
          <el-input v-model="visitor.age"></el-input>
        </el-form-item>
        <el-form-item label="DL#" prop="idNumber">
          <el-input v-model="visitor.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="Phone#" prop="phone">
          <el-input v-model="visitor.phone"></el-input>
        </el-form-item>
        <el-form-item label="Unit">
          <el-select
            v-model="visitor.unit.unitId"
            clearable
            placeholder=""
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
        <el-form-item label="Physician">
          <el-select
            v-model="visitor.employee.employeeId"
            clearable
            placeholder=""
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
          >Submit</el-button
        >
        <el-button type="primary" :disabled="isDisableds" @click="pay"
          >Pay</el-button
        >
        <el-button @click="closeDialog" :disabled="isDisabledss"
          >Cancel</el-button
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
        <el-form-item label="ID" prop="visitorId">
          <el-input v-model="visitor.visitorId" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="visitorName">
          <el-input v-model="visitor.visitorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="Unit">
          <el-select
            v-model="visitor.unit.unitId"
            clearable
            placeholder=""
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
        <el-form-item label="Physician">
          <el-select
            v-model="visitor.employee.employeeId"
            clearable
            placeholder=""
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
        <el-button type="primary" @click="onSubmitUpdate()">Submit</el-button>
        <el-button @click="closeDialogs">Cancel</el-button>
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
          { required: true, message: "Please Enter Name", trigger: "blur" },
          { min: 2, max: 18, message: "Length Out of range", trigger: "blur" },
        ],
        idNumber: [
          { required: true, message: "DL# ", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "2-12 Character",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "Select a Gender", trigger: "change" }],
        unit: [
          {
            type: "array",
            required: true,
            message: "Choose an unit",
            trigger: "change",
          },
        ],
        employee: [
          {
            type: "array",
            required: true,
            message: "choose a physician",
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
              message: "success",
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
                    message: "Check in success,paid: $" + price + " dollars",
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
            message: "Please pay first",
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
                item.gender = "Male";
              } else if (item.gender == 2) {
                item.gender = "Female";
              }
              if (item.clinicStatus == 1) {
                item.clinicStatus = "Waiting";
              } else if (item.clinicStatus == 2) {
                item.clinicStatus = "In Progress";
              } else {
                item.clinicStatus = "Done";
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