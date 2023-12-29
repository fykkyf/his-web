<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true">Create New Location</el-button>
    <el-table
        :data="locations"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="locationId"
          label="ID"
          width="100">
      </el-table-column>

      <el-table-column
          prop="locationName"
          label="Location">
      </el-table-column>
      <el-table-column prop="locationStatus" label="Status"
                       :filters="[{ text: 'Not in Use', value: '1' }, { text: 'In Use', value: '2' }]" :filter-method="filterTag"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.locationStatus === 1 ? 'success' : 'danger'" disable-transitions>{{
              scope.row.locationStatus === 2 ? 'In Use' : 'Not in Use' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="Operations"
          >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit"  @click="editLocation(scope.row)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete"  @click="confirmDelete(scope.row,scope.$index)" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Create New Location" :visible.sync="show">
      <el-form :model="location">
        <el-form-item label="Location" >
          <el-input v-model="location.locationName"></el-input>
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
        <el-button type="primary" @click="removeLocation">Confirm</el-button>
      </span>
    </el-dialog>
  </div>



</template>

<script>
export default {
  data() {
    return {
      locations:[],
      location:{
        locationId:'',
        locationName:'',
        locationStatus:'',
      },
      show:false,
      deleteIndex:'',
      showConfirm:  false,
    }
  },
  methods: {
    closeDialog() {
      this.show = false;
      this.location = {};
    },
    confirmDelete(row,index){

      this.location = row;
      this.deleteIndex = index;
      this.showConfirm=true;
    },
    getAllLocations(){
      this.$axios.get("http://localhost/location/get/all")
          .then(resp => {
        if (resp.data.code == 200) {

          this.locations = resp.data.data

        } else {
          this.$message(resp.data.data)
        }
      })
    },
    toUpdate(){
      console.log(this.location);
      this.$axios
          .post("http://localhost/location/updateLocation",this.location)
          .then(res=>{
            if(res.data.code==200 ) {
              this.$message("Created");
              this.getAllLocations();
              this.location={};

            }else if(res.data.code==201 ) {
              this.$message("Edit success");
              this.getAllLocations();
              this.location={};

            }else {
              this.$message("Error");
            }


      })
      this.getAllLocations();
      this.show=false;
      },
    editLocation(row){
      console.log(row);
      this.location = row;
      this.show=true;
    },
    removeLocation(){

      this.$axios
          .post("http://localhost/location/removeLocation/" + this.location.locationId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("Delete Success");
              this.locations.splice(this.deleteIndex, 1);
            } else if (res.data.code == 201){
              this.$message(res.data.data);
            } else{
              this.$message("Delete Failed")
            }

          })
      this.showConfirm=false;
    },

  },


  created() {
    this.getAllLocations();

  },


}
</script>

<style>

</style>