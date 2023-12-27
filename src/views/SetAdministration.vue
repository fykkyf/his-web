<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true" >Create New Indication</el-button>
    <el-table
        :data="administrations"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="administrationId"
          label="ID"
          width="100">
      </el-table-column>

      <el-table-column
          prop="administrationName"
          label="Indication" style="text-align: center">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.administrationName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="Operations"
      >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit" @click="editAdministration(scope.row)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="confirmDelete(scope.row,scope.$index)" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Create New Indication" :visible.sync="show">
      <el-form :model="administration">
        <el-form-item label="Indication" >
          <el-input v-model="administration.administrationName"></el-input>
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
        <el-button type="primary" @click="removeAdministration">Confirm</el-button>
      </span>
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
      deleteIndex:'',
      showConfirm:  false,
    }
  },
  methods: {
    closeDialog() {
      this.show = false;
      this.administration = {};
    },
    confirmDelete(row,index){

      this.administration = row;
      this.deleteIndex = index;
      this.showConfirm=true;
    },
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
    removeAdministration(){

      this.$axios
          .post("http://localhost/administration/remove/" + this.administration.administrationId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("Delete Success")
              this.administrations.splice(this.deleteIndex, 1);
            }else {
              this.$message("Delete Failed")
            }

          })
      this.showConfirm=false;
    },

  },


  created() {
    this.getAllAdministration();

  },


}
</script>

<style>

</style>