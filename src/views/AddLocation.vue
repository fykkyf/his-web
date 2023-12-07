<template>
  <div>
    <el-form :inline="true" style="float: left">
      <el-form-item label="住院号" style="font-weight: bold;">
        <el-input v-model="patientId" placeholder="住院号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPatientInfoByPatientIdAndLocation(patientId)">查询</el-button>
      </el-form-item>
    </el-form>
    <br><br><br>
    <el-table :data="patientInfos" style="width: 100%" >
      <el-table-column prop="patientId" label="患者编号" width="80px">
        <template slot-scope="scope">
          {{ scope.row.patientId !== null ? scope.row.patientId : "暂无信息" }}
        </template>
      </el-table-column>
      <el-table-column prop="visitorId" label="门诊编号" width="80px">
        <template slot-scope="scope">
          {{ scope.row.visitorId !== null ? scope.row.visitorId : "暂无信息" }}
        </template>
      </el-table-column>
      <el-table-column prop="patientName" label="患者姓名">
        <template slot-scope="scope">
          {{ scope.row.patientName !== null ? scope.row.patientName : "暂无信息" }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender === 1 ? ' ' : 'danger'" disable-transitions>
            {{ scope.row.gender === 1 ? '男' : '女' }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <template slot-scope="scope">
          {{ scope.row.age !== null ? scope.row.age : "暂无信息" }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="科室">

        <template slot-scope="scope">
          <el-tag :type="scope.row.unit.unitName !== null ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.unit !== null ? scope.row.unit.unitName : "暂无信息" }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="employee" label="医生">
        <template slot-scope="scope">
          <el-tag :type="scope.row.employee.employeeName !== null ? ' ' : 'danger'" disable-transitions>
            {{ scope.row.employee !== null ? scope.row.employee.employeeName : "暂无信息" }}</el-tag>

        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" plain @click="openDialog(scope.$index, scope.row)">添加床位</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="添加床位" :visible.sync="show">
      <el-form
          ref="patientInfoDTO"
          :model="patientInfoDTO"

          label-width="80px"
          class="demo-ruleForm"
      >
        <el-select v-model="patientInfoDTO.location"  clearable placeholder="请选择部门">
          <el-option
              v-for="item in locations"
              :key="item.locationId"
              :label="item.locationName"
              :value="item.locationId"
          ></el-option>

        </el-select>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show=false">取 消</el-button>
        <el-button type="primary" @click="addLocation(patientInfoDTO.location,index,patientId)"
        >确 定</el-button
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
          this.$message("没有此病人或该病人有床位")
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
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
  }

}
</script>

<style></style>