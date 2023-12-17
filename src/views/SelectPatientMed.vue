<template>
  <!-- 住院已发药查询 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="ImdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="ImdDTOs.dispenseTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="Order Date"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="End Date">
            <el-date-picker
              v-model="ImdDTOs.dispenseTime1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="Order Date"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="Patient ID">
            <el-input
              v-model="ImdDTOs.patientId"
              placeholder="Patient ID"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="selectPatientMed"
              >Search</el-button
            >
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div>
      <!-- 汇总查询展示 -->
      <div style="width: 20%">
        <el-table
          :data="ImdVOs"
        >
        
          <el-table-column prop="patientId" label="ID" width="55" >
          </el-table-column>
          
          <el-table-column prop="patientName" label="Name" >
          </el-table-column>
          
          <el-table-column  label="Operation">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectPatientMedmx(scope.row)"
                >Search Medication</el-button
              >
            </template>
          </el-table-column>
         
        </el-table>
      </div>
      <!-- 明细查询展示 -->
      <div class="right-div">
        <el-table
        border
          :data="ImdVO"
          style="width: 100%"
        >
         <!-- <el-table-column type="selection" width="30"> </el-table-column> -->
          <el-table-column
              prop="patientBillId"
              label="Bill ID"
              width="85"
              sortable
          >
          </el-table-column>

          <el-table-column prop="patientId" label="Patient ID"  sortable>
          </el-table-column>

          <el-table-column prop="patientName" label="Name" width="90" sortable>
          </el-table-column>
          <el-table-column prop="gender" label="Gender" width="100" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.gender === 1 ? ' ' : 'danger'" disable-transitions>
                {{ scope.row.gender === 1 ? 'Male' : 'Female' }}</el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="Unit" width="85" sortable>
          </el-table-column>
          <el-table-column
              prop="employeeName"
              label="Doctor"
              width="95"
              sortable
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.employee.employeeName !== null ? ' ' : 'danger'" disable-transitions>
                {{ scope.row.employee !== null ? scope.row.employee.employeeName : "None" }}</el-tag>

            </template>
          </el-table-column>
          <el-table-column
              prop="drugCode"
              label="Drug Tag"
              width="110"
              sortable
          >
          </el-table-column>
          <el-table-column
              prop="treatmentName"
              label="Drug Name"
              width="125"
              sortable
          >
          </el-table-column>
          <el-table-column prop="drugCount" label="Number" width="110" sortable>
          </el-table-column>
          <el-table-column
              prop="specification"
              label="Specification"

              sortable
          >
          </el-table-column>
          <el-table-column
              prop="orderDate"
              label="Order Date"

              sortable
          >
          </el-table-column>   
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      TreatmentDTO: {},
      ImdDTOs: {},  //汇总查询往后端传条件
     ImdDTO:{},//查询明细往后端传条件
      ImdVOs: [],//接收汇总
      ImdVO: [],//接收明细
    };
  },
  created() {},
  methods: {
    //汇总 查询出需要发药的患者名称和ID
    selectPatientMed() {
      this.$axios
        .post("http://localhost/treatment/selectPatientMed", this.ImdDTOs)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.ImdVOs = resp.data.data;
            //this.ImdDTOs = {};
          } else {
            //this.ImdDTOs = {};
          }
        });
    },
    //根据住院号或者日期查询明细
    selectPatientMedmx(row) {
      this.ImdDTO = row;
      console.log(this.ImdDTO);
      this.$axios
        .post("http://localhost/treatment/selectPatientMedmx", this.ImdDTO)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.ImdVO = resp.data.data;
           // this.ImdDTO = {};
          } else {
            //this.ImdDTO = {};
          }
        });
    },
  },
};
</script>

<style>
.right-div {
    position: absolute;
    top: 150px;
    right: 0;
  /* float: right; */
  width: 67%;
  background-color: #fff;
}
</style>