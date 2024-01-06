<template>
  <el-card>
    <!-- 条件查询 -->
    <el-form ref="form" :model="visitorInfo">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-form-item label="Name" label-width="80px">
            <el-input v-model="visitorInfo.visitorName" placeholder="Visitor Name" @input="getByCondition"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="DL" label-width="80px">
            <el-input v-model="visitorInfo.idNumber" placeholder="Driver's License" @input="getByCondition"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Status">
            <el-radio v-model="visitorInfo.clinicStatus"  @input="getByCondition" label="1">Pending</el-radio>
            <el-radio v-model="visitorInfo.clinicStatus"  @input="getByCondition" label="2">In Progress</el-radio>
            <el-radio v-model="visitorInfo.clinicStatus"  @input="getByCondition" label="3">Done</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="orderData" stripe border>
      <el-table-column prop="visitorId" label="ID" width="50px"> </el-table-column>
      <el-table-column prop="visitorName" label="Name" width="100px"> </el-table-column>
      <el-table-column prop="gender" label="Gender" width="80px"> </el-table-column>
      <el-table-column prop="age" label="Age" width="80px"> </el-table-column>
      <el-table-column prop="idNumber" label="DL #" width="100px"> </el-table-column>
      <el-table-column prop="phone" label="Phone #"> </el-table-column>
      <el-table-column prop="clinicDiagnosis.diseaseName" label="Diagnosis">
      </el-table-column>
      <el-table-column prop="clinicStartTime" label="Start time">
      </el-table-column>
      <el-table-column prop="clinicStatus" label="Status"> </el-table-column>
      <el-table-column label="Operations" width="350px">
        <template slot-scope="scope">
          <el-button type="success"  @click="handleEdit(scope.$index, scope.row)">Prescribe</el-button>
          <el-button type="primary"  @click="dealClick(scope.row)">Diagnosis</el-button>
          <el-button type="warning"  @click="openImage(scope.row)">Images</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 诊断的对话框 -->
    <el-dialog :title="myTitles" :visible.sync="shows">
      <el-form ref="visitor" :model="visitor" label-width="80px" justify="left">
        <el-form-item label="Visitor ID" prop="visitorId">
          <el-input v-model="visitor.visitorId" disabled style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Diagnosis">
          <el-select
            v-model="visitor.diseaseId"
            clearable
            placeholder=""
          >
            <el-option
              v-for="dis in diseases"
              :key="dis.diseaseId"
              :value="dis.diseaseId"
              :label="dis.diseaseName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shows = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmits()">Submit</el-button>
      </div>
    </el-dialog>

    <!-- 下医嘱的对话框 -->
    <div>
      <el-dialog
        title="Prescribe Information"
        :visible.sync="orderDialogVisible"
        width="80%"
        center
      >
        <el-form :model="clinicOrderDTO">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="10">
              <el-form-item label="ID:" label-width="150px">
                <el-input
                  v-model="clinicOrderDTO.visitorId"
                  disabled
                  style="width: 200px"
                ></el-input>
              </el-form-item>
              <el-form-item label="Treatment Type:" label-width="150px">
                <el-select
                  v-model="clinicOrderDTO.treatment.treatmentCategory"
                  placeholder=""
                  @change="getAllTreatments()"
                >
                  <el-option label="Medication" value="1"></el-option>
                  <el-option label="Treatment" value="2"></el-option>
                  <el-option label="Radiology Test" value="3"></el-option>
                  <el-option label="Lab Test" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Treatment Info:" label-width="150px">
                <el-select
                  v-model="clinicOrderDTO.treatment.treatmentId"
                  clearable
                  placeholder=""
                >
                  <el-option
                    v-for="item in treatments"
                    :key="item.treatmentId"
                    :label="item.treatmentName"
                    :value="item.treatmentId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Indication:" label-width="150px">
                <el-select
                  v-model="clinicOrderDTO.administrationId"
                  clearable
                  placeholder=""
                >
                  <el-option
                    v-for="item in administrations"
                    :key="item.administrationId"
                    :label="item.administrationName"
                    :value="item.administrationId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Dosage:" label-width="150px">
                <el-select
                  v-model="clinicOrderDTO.dosageId"
                  clearable
                  placeholder=""
                >
                  <el-option
                    v-for="item in dosages"
                    :key="item.dosageId"
                    :label="item.dosageName"
                    :value="item.dosageId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Number:" label-width="150px">
                <el-input
                  v-model="clinicOrderDTO.treatmentCount"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitPatientOrder()"
            >Submit</el-button
          >
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      visitorInfo: {
        // unitId:null,
        // doctorId:null
        gender: null,
      },
      myTitles: "",
      orderDialogVisible: false,
      orderData: [],
      clinicOrderDTO: {
        treatment: {},
      },
      treatments: [],
      visitor: {},
      administrations: [],
      dosages: [],
      diseases: [],
      shows: false,
      fileName: "",
    };
  },
  methods: {
    //下医嘱---确认按钮
    submitPatientOrder() {
      console.log(this.clinicOrderDTO.visitorId);
      console.log("这是a:" + this.clinicOrderDTO.administrationId);
      console.log("这是d:" + this.clinicOrderDTO.dosageId);
      this.$axios
        .post(
          "http://localhost/clinicOrder/addClinicOrder",
          this.clinicOrderDTO
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.$message.success("Success");
            this.orderDialogVisible = false;
            this.getByCondition();
          } else {
            this.$message.warning(resp.data.data);
          }
        });
    },
    dealClick(row) {
      this.shows = true;
      this.visitor = Object.assign({}, row, {});
    },
    handleEdit(index, row) {
      this.$axios
        .post(
          "http://localhost/visitorInfo/updateChecking?visitorId=" +
            row.visitorId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "Success",
              type: "success",
            });
            this.orderDialogVisible = true;
            this.clinicOrderDTO = Object.assign({}, row, {
              treatment: {},
            });
          }
        });
    },
    //查询所有疾病
    getAllDiseases() {
      this.$axios.get("http://localhost/disease/get/all").then((res) => {
        if (res.data.code == 200) {
          this.diseases = res.data.data;
        }
      });
    },
    //查询所有用量信息
    getAllDosages() {
      this.$axios.get("http://localhost/dosage/getAll").then((resp) => {
        if (resp.data.code == 200) {
          this.dosages = resp.data.data;
        } else {
          this.$message.warning(resp.data.data);
        }
      });
    },
    //查询所有用法信息
    getAllAdministrations() {
      this.$axios.get("http://localhost/administration/getAll").then((resp) => {
        if (resp.data.code == 200) {
          this.administrations = resp.data.data;
        } else {
          this.$message.warning(resp.data.data);
        }
      });
    },
    //查询所有项目
    getAllTreatments() {
      let treatmentDTO = {
        treatmentCategory: this.clinicOrderDTO.treatment.treatmentCategory,
      };
      this.$axios
        .post(
          "http://localhost/treatment/selectAllTreatmentByCategory",
          treatmentDTO
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.treatments = resp.data.data;
          } else {
            this.$message.warning(resp.data.data);
          }
        });
    },
    //查看图片
    openImage(row) {
      console.log(row.visitorId);
      this.$axios
        .post(
          "http://localhost/clinicRaidology/getPictureFileName" +
            "/" +
            row.visitorId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.fileName = res.data.data;
            if (this.fileName && this.fileName !== "./null") {
              // 检查 this.fileName 是否为空或者是否为 './null'
              let url = require("@/assets/images/" + this.fileName);
              window.open(url, "_blank");
            } else {
              this.$message({
                message: "No Images",
                type: "error",
              });
            }
          } else {
            this.$message({
              message: "No Images",
              type: "error",
            });
          }
        });
    },
    // openImage(row) {
    //   console.log(row.visitorId);
    //   this.$axios
    //     .post(
    //       "http://localhost/clinicRaidology/getPictureFileName" +
    //         "/" +
    //         row.visitorId
    //     )
    //     .then((res) => {
    //       if (res.data.code == 200) {
    //         this.fileName = res.data.data;
    //         let url = require("@/assets/images/" + this.fileName);
    //         window.open(url, "_blank");
    //       } else {
    //         this.$message({
    //           message: "暂无图片",
    //           type: "error",
    //         });
    //       }
    //     });
    // },

    //诊断确定按钮
    onSubmits() {
      console.log("这里是visitorId" + this.visitor.visitorId);
      console.log("这里是" + this.visitor.diseaseId);
      this.$axios
        .post(
          "http://localhost/visitorInfo/updateDisease?visitorId=" +
            this.visitor.visitorId +
            "&diseaseId=" +
            this.visitor.diseaseId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              message: "Success",
              type: "success",
            });
          }
          this.getByCondition();
          this.shows = false;
        });
    },
    getByCondition() {
      this.$axios
        .post("http://localhost/visitorInfo/getByCondition", this.visitorInfo)
        .then((res) => {
          if (res.data.code == 200) {
            this.orderData = res.data.data;
            this.orderData.forEach((item) => {
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
    //通过token,获取挂号信息
    // getVisitorByEmployeeId() {
    //   this.$axios
    //     .get("http://localhost/visitorInfo/getVisitorByEmployeeId")
    //     .then((res) => {
    //       if (res.data.code == 200) {
    //         this.orderData = res.data.data;
    //       }
    //     });
    // },

    //通过token,以及条件，查询挂号的人的信息,要使用的时候，记得修改输入框绑定的方法
    // getVisitorByIdAndCondition() {
    //   this.$axios
    //     .post(
    //       "http://localhost/visitorInfo/getVisitorByIdAndCondition",
    //       this.visitorInfo
    //     )
    //     .then((res) => {
    //       if (res.data.code == 200) {
    //         this.orderData = res.data.data;
    //         this.orderData.forEach((item) => {
    //           if (item.gender == 1) {
    //             item.gender = "男";
    //           } else if (item.gender == 2) {
    //             item.gender = "女";
    //           }
    //           if (item.clinicStatus == 1) {
    //             item.clinicStatus = "候诊";
    //           } else if (item.clinicStatus == 2) {
    //             item.clinicStatus = "就诊";
    //           } else {
    //             item.clinicStatus = "过诊";
    //           }
    //         });
    //       }
    //     });
    // },
  },
  created() {
    this.getByCondition();
    this.getAllAdministrations();
    this.getAllDosages();
    this.getAllDiseases();
    // this.getVisitorByEmployeeId();
  },
};
</script>

<style>
</style>