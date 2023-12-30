<template>
  <div>
    <div>
      <el-form ref="form" :model="patientRaidologyDTO" label-width="100px">
        <el-col :span="4">
          <div>
            <h1 class="clinic-title">Radiology Station</h1>
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Start time">
            <el-date-picker v-model="patientRaidologyDTO.testDate" type="date" value-format="yyyy/MM/dd"
              placeholder="">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="End Time">
            <el-date-picker v-model="patientRaidologyDTO.testDate1" type="date" value-format="yyyy/MM/dd"
              placeholder="">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="Patient ID">
            <el-input v-model="patientRaidologyDTO.patientId" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Status">
            <el-radio v-model="patientRaidologyDTO.testStatus" label="1">Pending</el-radio>
            <el-radio v-model="patientRaidologyDTO.testStatus" label="2">Finished</el-radio>
            <el-radio v-model="patientRaidologyDTO.testStatus" label="null">All</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getByKeyWord">Search</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="patientRaidologyId" label="ID" width="100px">
      </el-table-column>
      <el-table-column prop="patientBillId" label="Order#" width="100px">
      </el-table-column>
      <el-table-column prop="patientId" label="Patient#" width="100px">
      </el-table-column>
      <el-table-column prop="patientName" label="Name">
      </el-table-column>
      <el-table-column prop="unitName" label="Unit">
      </el-table-column>
      <el-table-column prop="employeeName" label="Physician">
      </el-table-column>
      <el-table-column prop="treatmentName" label="Treatment" width="350px"> </el-table-column>

      <el-table-column label="Picture">
        <template slot-scope="scope">
          <el-button size="mini" @click="toupdate(scope.row)">Upload</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="上传">
        <template slot-scope="scope">
          <el-upload
            action="#"
            :multiple="false"
            :limit="1"
            ref="fileInput"
            :on-change="uploadFile"
          >
            <el-button
              size="small"
              type="primary"
              @click="uploadFile(scope.row)"
              >点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </template>
      </el-table-column> -->
    </el-table>


    <el-dialog :title="myTitle" :visible.sync="show">
      <el-form ref="patientRaidology" :model="patientRaidology" label-width="80px">
        <el-form-item label="ID" prop="patientRaidologyId" label-width="100px">
          <el-input v-model="patientRaidology.patientRaidologyId" disabled></el-input>
        </el-form-item>
        <el-form-item label="Patient #" prop="patientId" label-width="100px">
          <el-input v-model="patientRaidology.patientId" disabled></el-input>
        </el-form-item>
        <el-form-item label="Treatment #" prop="treatmentId" label-width="100px">
          <el-input v-model="patientRaidology.treatmentId" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-upload
                    ref="upload" # 插眼
                    action="" # 原来的提交方法，这里我们把他覆盖了
                    class="upload-demo"
                    :http-request="httpRequest" # 覆盖原本的提交方法，我们指定一个函数，在其中完成参数的提取，当然你也可以在其他的需求中对他进行直接提交
                    :on-preview="handlePreview" # 当点击已上传的文件时执行的函数
                    :multiple="false" # 是否允许多文件提交
                    :limit="1" # 最大支持上传的文件数量
                    :auto-upload="false" # 关闭自动提交
                    :file-list="data.file" # 文件数据存储的位置,这里只是元数据，文件流只有真正提交的时候才会拥有
                >-->
          <el-upload ref="upload" action="" class="upload-demo" :http-request="httpRequest" :multiple="false" :limit="1"
            :auto-upload="false" :file-list="patientRaidology.file">
            <el-button size="small" type="primary">Select  File</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Submit</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myTitle: "",
      show: false,
      tableData: [],
      patientRaidology: {
        patientRaidologyId: "",
      },
      patientBill: {
        patientBillIdId: "",
      },
      patientRaidologyDTO: {}
    };
  },
  methods: {
    getByKeyWord() {
      console.log(this.patientRaidologyDTO)
      this.$axios.post("http://localhost/patientRaidology/getByKeyWord", this.patientRaidologyDTO).then(resp => {
        if (resp.data.code == 200) {
          this.tableData = resp.data.data
        } else {
          this.$message.warning(resp.data.data)
        }
      })
    },
    closeDialog() {
      this.patientRaidology = {};
      this.show = false;
    },
    httpRequest(param) {
      this.patientRaidology.file = param.file;
    },
    onSubmit() {
      this.$refs.upload.submit();
      const formData = new FormData();
      formData.append("id", this.patientRaidology.patientRaidologyId);
      formData.append("file", this.patientRaidology.file);
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post("http://localhost/patientRaidology/upload", formData, config)
        .then((res) => {
          if (res.data.code == 200) {
            this.updateManipulateStatus();
          }
        });
    },
    updateManipulateStatus() {
      this.$axios.post("http://localhost/patientBill/modifyManipulateStatus", this.patientBill).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: "Add Success",
            type: "success"
          })
          this.show = false;
          this.get();
        } else {
          this.$message({
            message: "Add failed",
            type: "error"
          })
        }
      })
    },
    toupdate(row) {
      this.patientRaidology.patientId = row.patientId
      this.patientRaidology.treatmentId = row.treatmentId;
      this.show = true;
      this.patientRaidology.patientRaidologyId = row.patientRaidologyId;
      this.patientBill = {
        patientBillId: row.patientBillId
      }
      this.myTitle = "Add File";
    },
    getAllPatientRaidos() {
      this.$axios.get("http://localhost/patientRaidology/getAll").then((resp) => {
        if (resp.data.code == 200) {
          this.tableData = resp.data.data;
        } else {
          this.$message.warning(resp.data.data)
        }
      });
    },
  },
  mounted() {
    this.getAllPatientRaidos();
  },
};
</script>

<style></style>