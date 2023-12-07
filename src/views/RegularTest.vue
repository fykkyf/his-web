<template>
  <div>
    <div style="margin-top: 50px;">
      <el-form ref="regularTest" :model="regularTest" label-width="80px">
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label="患者住院号" label-width="100px">
              <el-input placeholder="请输入患者住院号" v-model="regularTest.patientId" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="血压" label-width="100px">
              <el-input placeholder="请输入患者血压" v-model="regularTest.pressure" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="血糖" label-width="100px">
              <el-input placeholder="请输入患者血糖" v-model="regularTest.sugar" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="体温" label-width="100px">
              <el-input placeholder="请输入患者体温" v-model="regularTest.temp" style="width: 300px;"></el-input>
            </el-form-item>




          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.regularTest = {}">取 消</el-button>
        <el-button type="primary" @click="submitRegularTest()">确 定</el-button>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      regularTest: {},

    }
  },
  created() {

  },
  methods: {
    //添加病人信息
    submitRegularTest() {
      this.$axios.post("http://localhost/regular/post",this.regularTest)
          .then(res => {
        if (res.data.code==200){
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      })
    },


  }

}
</script>

<style></style>
