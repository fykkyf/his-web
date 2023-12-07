<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true" >添加新用法</el-button>
    <el-table
        :data="administrations"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="administrationId"
          label="用法编号"
          width="100">
      </el-table-column>

      <el-table-column
          prop="administrationName"
          label="用法" style="text-align: center">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.administrationName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit" @click="editAdministration(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeAdministration(scope.row,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用法信息" :visible.sync="show">
      <el-form :model="administration">
        <el-form-item label="用法" >
          <el-input v-model="administration.administrationName"></el-input>
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
      administrations:[],
      administration:{
        administrationId:'',
        administrationName:'',
      },
      show:false,

    }
  },
  methods: {

    getAllAdministration(){
      this.$axios.get("http://localhost/administration/getAll")
          .then(resp => {
            if (resp.data.code == 200) {

              this.administrations = resp.data.data

            } else {
              this.$message(resp.data.msg)
            }
          })
    },
    toUpdate(){
      console.log(this.administration);
      this.$axios
          .post("http://localhost/administration/update",this.administration)
          .then(res=>{
            if(res.data.code==200){
              this.$message(res.data.msg);
              this.getAllAdministration();
              this.administration = '';
            }else {
              this.$message(res.data.msg);
            }

          })
      this.show=false;
    },
    editAdministration(row){
      console.log(row);
      this.administration = row;
      this.show=true;
    },
    removeAdministration(row, index){

      this.$axios
          .post("http://localhost/administration/remove/" + row.administrationId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("删除成功")
              this.administrations.splice(index, 1);
            }else {
              this.$message("删除失败")
            }

          })
    },

  },


  created() {
    this.getAllAdministration();

  },


}
</script>

<style>

</style>