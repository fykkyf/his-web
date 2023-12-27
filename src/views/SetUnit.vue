<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true">Create New Unit</el-button>
    <el-table
        :data="units"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="unitId"
          label="ID"
          width="100">
      </el-table-column>

      <el-table-column
          prop="unitName"
          label="Unit Name">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.unitName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="Operations"
      >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit"  @click="editUnit(scope.row)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete"  @click="confirmDelete(scope.row,scope.$index)" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Create New unit" :visible.sync="show">
      <el-form :model="unit">
        <el-form-item label="Name" >
          <el-input v-model="unit.unitName"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="toUpdate">Submit</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Confirm" :visible.sync="showConfirm">
      <span>Please Confirm if You Want to Delete</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirm = false">Cancel</el-button>
        <el-button type="primary" @click="removeUnit">Confirm</el-button>
      </span>
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
      deleteIndex:'',
      showConfirm:  false,
    }
  },
  methods: {
    closeDialog() {
      this.show = false;
      this.unit = {};
    },
    confirmDelete(row,index){

      this.unit = row;
      this.deleteIndex = index;
      this.showConfirm=true;
    },
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
    removeUnit(){

      this.$axios
          .post("http://localhost/unit/remove/" + this.unit.unitId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("Delete Success")
              this.units.splice(this.deleteIndex, 1);
            }else {
              this.$message("Delete Failed")
            }

          })
      this.showConfirm=false;
    },

  },


  created() {
    this.getAllUnits();

  },


}
</script>

<style>

</style>