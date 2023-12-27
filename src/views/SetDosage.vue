<template>
  <div>
    <el-button type="success"   icon="el-icon-plus" @click="show=true">Create New Dosage</el-button>
    <el-table
        :data="dosages"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="dosageId"
          label="ID"
          width="100">
      </el-table-column>

      <el-table-column
          prop="dosageName"
          label="Dosage">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.dosageName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="Operations"
      >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editDosage(scope.row)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="confirmDelete(scope.row,scope.$index)" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Create New Dosage" :visible.sync="show">
      <el-form :model="dosage">
        <el-form-item label="Dosage" >
          <el-input v-model="dosage.dosageName"></el-input>
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
        <el-button type="primary" @click="removeDosage">Confirm</el-button>
      </span>
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
      deleteIndex:'',
      showConfirm:  false,
    }
  },
  methods: {
    closeDialog() {
      this.show = false;
      this.dosage = {};
    },
    confirmDelete(row,index){

      this.dosage = row;
      this.deleteIndex = index;
      this.showConfirm=true;
    },
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
    removeDosage(){

      this.$axios
          .post("http://localhost/dosage/remove/" + this.dosage.dosageId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("Delete Success")
              this.dosages.splice(this.deleteIndex, 1);
            }else {
              this.$message("Delete Failed")
            }

          })
      this.showConfirm=false;
    },

  },


  created() {
    this.getAllDosages();

  },


}
</script>

<style>

</style>