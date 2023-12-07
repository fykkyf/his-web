<template>
  <div>
    <el-button type="success"   icon="el-icon-plus" @click="show=true">添加新用量</el-button>
    <el-table
        :data="dosages"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="dosageId"
          label="用量编号"
          width="100">
      </el-table-column>

      <el-table-column
          prop="dosageName"
          label="用量">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.dosageName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editDosage(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeDosage(scope.row,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用量信息" :visible.sync="show">
      <el-form :model="dosage">
        <el-form-item label="用量" >
          <el-input v-model="dosage.dosageName"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="toUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>



</template>

<script>
export default {
  data() {
    return {
      dosages:[],
      dosage:{
        dosageId:'',
        dosageName:'',
      },
      show:false,

    }
  },
  methods: {

    getAllDosages(){
      this.$axios.get("http://localhost/dosage/getAll")
          .then(resp => {
            if (resp.data.code == 200) {

              this.dosages = resp.data.data

            } else {
              this.$message(resp.data.msg)
            }
          })
    },
    toUpdate(){
      console.log(this.dosage);
      this.$axios
          .post("http://localhost/dosage/update",this.dosage)
          .then(res=>{
            if(res.data.code==200){
              this.$message(res.data.msg);
              this.getAllDosages();
              this.dosage = '';
            }else {
              this.$message(res.data.msg);
            }

          })
      this.show=false;
    },
    editDosage(row){
      console.log(row);
      this.dosage = row;
      this.show=true;
    },
    removeDosage(row, index){

      this.$axios
          .post("http://localhost/dosage/remove/" + row.dosageId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("删除成功")
              this.dosages.splice(index, 1);
            }else {
              this.$message("删除失败")
            }

          })
    },

  },


  created() {
    this.getAllDosages();

  },


}
</script>

<style>

</style>