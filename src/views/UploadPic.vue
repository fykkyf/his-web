<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="clinicRaidologyId" label="检查号">
      </el-table-column>
      <el-table-column prop="visitorInfo.visitorId" label="就诊号">
      </el-table-column>
      <el-table-column prop="visitorInfo.visitorName" label="病人姓名">
      </el-table-column>
      <el-table-column prop="treatment.treatmentId" label="项目id"> </el-table-column>
      <el-table-column prop="treatment.treatmentName" label="项目名称"> </el-table-column>
      <el-table-column prop="visitorInfo.gender" label="性别">
      </el-table-column>
      <el-table-column label="添加图片">
        <template slot-scope="scope">
          <el-button size="mini" @click="toupdate(scope.row)"
            >添加图片</el-button
          >
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
      <el-form
        ref="clinicRaidology"
        :model="clinicRaidology"
        label-width="80px"
      >
        <el-form-item label="检查号" prop="clinicRaidologyId">
          <el-input
            v-model="clinicRaidology.clinicRaidologyId"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="就诊号" prop="visitorId">
          <el-input
            v-model="clinicRaidology.visitorId"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="项目号" prop="treatmentId">
          <el-input
            v-model="clinicRaidology.treatmentId"
            disabled
          ></el-input>
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
          <el-upload
            ref="upload"
            action=""
            class="upload-demo"
            :http-request="httpRequest"
            :multiple="false"
            :limit="1"
            :auto-upload="false"
            :file-list="clinicRaidology.file"
          >
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item> -->
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
      clinicRaidology: {
        id: "",
      },
      visitorBill:{
        visitorId:"",
        treatmentId:""
      }
    };
  },
  methods: {
    closeDialog() {
      this.visitor = {};
      this.show = false;
    },
    httpRequest(param) {
      this.clinicRaidology.file = param.file;
    },
    onSubmit() {
      this.$refs.upload.submit();
      const formData = new FormData();
      formData.append("id", this.clinicRaidology.clinicRaidologyId);
      formData.append("file", this.clinicRaidology.file);
      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios
        .post("http://localhost/clinicRaidology/upload", formData, config)
        .then((res) => {
          if(res.data.code==200){
            this.updateManipulateStatus();
          }
        });
    },
    updateManipulateStatus(){
      this.visitorBill.visitorId=this.clinicRaidology.visitorId;
      this.visitorBill.treatmentId=this.clinicRaidology.treatmentId;
      this.$axios.post("http://localhost/visitorBill/updateManipulateStatus",this.visitorBill).then(res=>{
          if(res.data.code==200){
            this.$message({
              message:"添加成功",
              type:"success"
            })
            this.show=false;
            this.get();
          }else{
            this.$message({
              message:"有问题，添加失败",
              type:"error"
            })
          }
      })
    },
    toupdate(row) {
      this.clinicRaidology.visitorId=row.visitorInfo.visitorId
      this.clinicRaidology.treatmentId=row.treatment.treatmentId;
      this.show = true;
      this.clinicRaidology.clinicRaidologyId = row.clinicRaidologyId;
      this.myTitle = "添加图片";
    },
    get() {
      this.$axios
        .post(
          "http://localhost/visitorInfo/getVisitorInfoIdByPaySuccessAndManipulateStatus"
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.tableData.forEach((item) => {
              if (item.visitorInfo.gender == 1) {
                item.visitorInfo.gender = "男";
              } else if (item.visitorInfo.gender == 2) {
                item.visitorInfo.gender = "女";
              }
            });
          }
        });
    },
  },
  mounted() {
    this.get();
  },
};
</script>

<style>
</style>