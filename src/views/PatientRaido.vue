<template>
  <div>
    <div>
      <el-form ref="form" :model="patientRaidologyDTO" label-width="100px">
        <el-col :span="4">
          <div>
            <h1 class="clinic-title">住院检查站</h1>
          </div>
        </el-col>
        <el-col :span="7">
          <el-form-item label="开始日期">
            <el-date-picker v-model="patientRaidologyDTO.testDate" type="date" value-format="yyyy-MM-dd"
              placeholder="检查日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="截止日期">
            <el-date-picker v-model="patientRaidologyDTO.testDate1" type="date" value-format="yyyy-MM-dd"
              placeholder="检查日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="住院号">
            <el-input v-model="patientRaidologyDTO.patientId" placeholder="住院号"></el-input>
          </el-form-item>
          <el-form-item label="检查状态">
            <el-radio v-model="patientRaidologyDTO.testStatus" label="1">未检查</el-radio>
            <el-radio v-model="patientRaidologyDTO.testStatus" label="2">已检查</el-radio>
            <el-radio v-model="patientRaidologyDTO.testStatus" label="null">不限</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getByKeyWord">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="patientRaidologyId" label="检查号">
      </el-table-column>
      <el-table-column prop="patientBillId" label="费用号">
      </el-table-column>
      <el-table-column prop="patientId" label="住院号">
      </el-table-column>
      <el-table-column prop="patientName" label="病人姓名">
      </el-table-column>
      <el-table-column prop="unitName" label="科室">
      </el-table-column>
      <el-table-column prop="employeeName" label="医生">
      </el-table-column>
      <el-table-column prop="treatmentName" label="项目名称"> </el-table-column>

      <el-table-column label="添加图片">
        <template slot-scope="scope">
          <el-button size="mini" @click="toupdate(scope.row)">添加图片</el-button>
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
        <el-form-item label="检查编号" prop="patientRaidologyId">
          <el-input v-model="patientRaidology.patientRaidologyId" disabled></el-input>
        </el-form-item>
        <el-form-item label="住院编号" prop="patientId">
          <el-input v-model="patientRaidology.patientId" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目编号" prop="treatmentId">
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
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
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
            message: "添加成功",
            type: "success"
          })
          this.show = false;
          this.get();
        } else {
          this.$message({
            message: "有问题，添加失败",
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
      this.myTitle = "添加图片";
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