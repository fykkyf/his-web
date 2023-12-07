<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true">添加新科室</el-button>
    <el-table
        :data="units"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="unitId"
          label="科室编号"
          width="100">
      </el-table-column>

      <el-table-column
          prop="unitName"
          label="科室名称">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.unitName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit"  @click="editUnit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete"  @click="removeUnit(scope.row,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加科室信息" :visible.sync="show">
      <el-form :model="unit">
        <el-form-item label="科室名称" >
          <el-input v-model="unit.unitName"></el-input>
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
      units:[],
      unit:{
        unitId:'',
        unitName:'',
      },
      show:false,

    }
  },
  methods: {

    getAllUnits(){
      this.$axios.get("http://localhost/unit/getAll")
          .then(resp => {
            if (resp.data.code == 200) {

              this.units = resp.data.data

            } else {
              this.$message(resp.data.data)
            }
          })
    },
    toUpdate(){
      console.log(this.unit);
      this.$axios
          .post("http://localhost/unit/update",this.unit)
          .then(res=>{
            if(res.data.code==200){
                this.$message(res.data.msg);
                this.getAllUnits();
                this.unit = '';
          }else {
              this.$message(res.data.msg);
          }

          })
      this.show=false;
    },
    editUnit(row){
      console.log(row);
      this.unit = row;
      this.show=true;
    },
    removeUnit(row, index){

      this.$axios
          .post("http://localhost/unit/remove/" + row.unitId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("删除成功")
              this.units.splice(index, 1);
            }else {
              this.$message("删除失败")
            }

          })
    },

  },


  created() {
    this.getAllUnits();

  },


}
</script>

<style>

</style>