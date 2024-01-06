<template>
  <!-- 门诊已经发药 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="OmdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="OmdDTOs.dispenseTime"
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
              v-model="OmdDTOs.dispenseTime1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="Order Date"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="Visitor ID">
            <el-input
              v-model="OmdDTOs.visitorId"
              placeholder=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="selectClinicMed"
              >Search</el-button
            >
          </el-form-item>
        </el-col>
           <el-col :span="2">
        </el-col>
      </el-form>
    </div>
    <div>
      <!-- 汇总查询展示 -->
      <div style="width: 20%">
        <el-table
          :data="OmdVOs"
        >
        
          <el-table-column prop="visitorId" label="ID" width="55" >
          </el-table-column>
          
          <el-table-column prop="visitorName" label="Name"  >
          </el-table-column>
          
          <el-table-column  label="Operation">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectClinicMedmx(scope.row)"
                >Select</el-button
              >
            </template>
          </el-table-column>
         
        </el-table>
      </div>
      <!-- 明细查询展示 -->
      <div class="right-div">
        <el-table
        border
          :data="OmdVO"
          style="width: 100%" 
        >
         <!-- <el-table-column type="selection" width="30"> </el-table-column> -->
          <el-table-column
            prop="visitorBillId"
            label="Bill#"
            width="75"
            sortable
          >
          </el-table-column>
           
          <el-table-column prop="visitorId" label="Visitor#" width="80" >
          </el-table-column>
          
          <el-table-column prop="visitorName" label="Name" width="90" >
          </el-table-column>
          <el-table-column prop="gender" label="Gender" width="80" >
            <template slot-scope="scope">
              <el-tag :type="scope.row.gender === 1 ? ' ' : 'danger'" disable-transitions>
                {{ scope.row.gender === 1 ? 'Male' : 'Female'}}</el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="Unit" width="120" sortable>
          </el-table-column>
          <el-table-column
              prop="employeeName"
              label="Physician"
              width="85"

          >

          </el-table-column>
          <el-table-column
              prop="drugCode"
              label="Drug Tag"
              width="90"

          >
          </el-table-column>
          <el-table-column
              prop="treatmentName"
              label="Drug Name"
              width="175"
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
      OmdDTOs: {
        // dispenseTime: new Date().toISOString().split('T')[0],
        // dispenseTime1: new Date().toISOString().split('T')[0],
      },//汇总查询往后端传条件 
      OmdDTO:{},//查询明细往后端传条件
      OmdVOs: [],//接收汇总
      OmdVO: [],//接收明细
    };
  },
  created() {},
  methods: {
    //汇总 查询出需要发药的患者名称和ID
    selectClinicMed() {
      this.$axios
        .post("http://localhost/treatment/selectClinicMed", this.OmdDTOs)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.OmdVOs = resp.data.data;
            //this.OmdDTO = {};
          } else {
            //this.OmdDTO = {};
          }
        });
    },
    //根据门诊号或者日期查询明细
    selectClinicMedmx(row) {
      this.OmdDTO = row;
      console.log(this.OmdDTO);
      this.$axios
        .post("http://localhost/treatment/selectClinicMedmx", this.OmdDTO)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.OmdVO = resp.data.data;
           // this.OmdDTO = {};
          } else {
           // this.OmdDTO = {};
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