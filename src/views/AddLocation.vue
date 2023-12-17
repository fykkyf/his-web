<template>
  <div>
    <el-form :inline="true" style="float: left">
      <el-form-item label="Patient ID" style="font-weight: bold;">
        <el-input v-model="patientId" placeholder="Patient ID"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPatientInfoByPatientIdAndLocation(patientId)">Search</el-button>
      </el-form-item>
    </el-form>
    <br><br><br>
    <el-table :data="patientInfos" style="width: 100%" >
      <el-table-column prop="patientId" label="Patient ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.patientId !== null ? scope.row.patientId : "None" }}
        </template>
      </el-table-column>
      <el-table-column prop="visitorId" label="Visitor ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.visitorId !== null ? scope.row.visitorId : "None" }}
        </template>
      </el-table-column>
      <el-table-column prop="patientName" label="Patient Name">
        <template slot-scope="scope">
          {{ scope.row.patientName !== null ? scope.row.patientName : "None" }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="Gender">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender === 1 ? ' ' : 'danger'" disable-transitions>
            {{ scope.row.gender === 1 ? 'Male' : 'Female' }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="age" label="Age">
        <template slot-scope="scope">
          {{ scope.row.age !== null ? scope.row.age : "None" }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="Unit">

        <template slot-scope="scope">
          <el-tag :type="scope.row.unit.unitName !== null ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.unit !== null ? scope.row.unit.unitName : "None" }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="employee" label="Doctor">
        <template slot-scope="scope">
          <el-tag :type="scope.row.employee.employeeName !== null ? ' ' : 'danger'" disable-transitions>
            {{ scope.row.employee !== null ? scope.row.employee.employeeName : "None" }}</el-tag>

        </template>
      </el-table-column>

      <el-table-column label="Options">
        <template slot-scope="scope">
          <el-button type="success" plain @click="openDialog(scope.$index, scope.row)">Add Bed </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="Location Management" :visible.sync="show">
      <el-form
          ref="patientInfoDTO"
          :model="patientInfoDTO"

          label-width="80px"
          class="demo-ruleForm"
      >
        <el-select v-model="patientInfoDTO.location"  clearable placeholder="Choose Department">
          <el-option
              v-for="item in locations"
              :key="item.locationId"
              :label="item.locationName"
              :value="item.locationId"
          ></el-option>

        </el-select>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show=false">cancel</el-button>
        <el-button type="primary" @click="addLocation(patientInfoDTO.location,index,patientId)"
        >Submit</el-button
        >

      </div>
    </el-dialog>
  </div>
</template>
<script>
import index from "@/views/Index.vue";

export default {
  data() {
    return {
      patientInfos: [],

      patientInfoDTO: {
        unitId: '',
        doctorId: ''
      },
      //所有科室
      units: [],
      employees: [],
      locations:[
      ],
      location:{
        locationId:'',
        locationName:'',
      },

      show:false,
      index:'',
      patientId:'',

    }
  },
  created() {
    this.getNoLocationPatients();
    this.getAllUnits();
    this.getAllDoctors();
    this.getAllEmptyLocation();
  },
  methods: {
    getPatientInfoByPatientIdAndLocation(patientId) {
      this.$axios.get("http://localhost/patientInfo/getPatientInfoByPatientIdAndLocation/"+patientId).then((res) => {
        if(res.data.code==200){
          this.patientInfos= res.data.data;
        }else {
          this.$message("No Information Found")
        }


      });
    },
    getNoLocationPatients(){
      this.$axios.get("http://localhost/patientInfo/getPatientInfoByLocation").then(resp =>{
        if(resp.data.code==200){
          this.patientInfos=resp.data.data;
        }

      })

    },
    //查询所有医生
    getAllDoctors() {
      this.patientInfoDTO.unitId = '',
          this.$axios.get("http://localhost/employee/getAllEmployee").then(resp => {
            if (resp.data.code == 200) {
              this.employees = resp.data.data
            } else {
              this.$message(resp.data.data)
            }
          })
    },
    //查询所有科室
    getAllUnits() {
      this.$axios.get("http://localhost/unit/getAll").then(resp => {
        if (resp.data.code == 200) {
          this.units = resp.data.data
        } else {
          this.$message(resp.data.data)
        }
      })
    },
    getAllEmptyLocation(){
      this.$axios.get("http://localhost/location/emptyLocation").then(resp => {
        if (resp.data.code == 200) {

          this.locations = resp.data.data

        } else {
          this.$message(resp.data.data)
        }
      })
    },
    openDialog(index,row){
      this.show=true;
      this.index=index;
      this.patientId=row.patientId;

    },
    addLocation(locationId,index,patientId){

      this.$axios.post("http://localhost/patientInfo/addLocation", {locationId,patientId})
          .then(res=>{
            if (res.data.code==200){
              this.$message({
                message: res.data.data,
                type: "success",
              });
              this.patientInfos.splice(index,1);
              this.patientInfoDTO='';
              this.getNoLocationPatients();
              this.getAllEmptyLocation();
              this.show=false;


            }

      })

    },
    handleClose(done) {
      this.$confirm('Close Conformation？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
  }

}
</script>

<style></style>