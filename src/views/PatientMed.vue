<template>
  <!-- 住院发药 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="ImdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="ImdDTOs.orderDate"
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
              v-model="ImdDTOs.orderDate1"
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
              @click="selectPatientByImd"
              >Search</el-button
            >
          </el-form-item>
        </el-col>
           <el-col :span="2">
          <!-- <el-form-item label="">
            <el-button
              type="success" 
              plain
              class="el-icon-s-promotion"
              @click="imd"
              >确认发药</el-button
            >
          </el-form-item> -->
        </el-col>
      </el-form>
    </div>
    <div>
      <!-- 汇总查询展示 -->
      <div style="width:320px">
        <el-table
          :data="ImdVOs"
          
          :row-class-name="tableRowClassName"
        >
        
          <el-table-column prop="patientId" label="ID" width="55" >
          </el-table-column>
          
          <el-table-column prop="patientName" label="Name" >
          </el-table-column>
          
          <el-table-column  label="Operation">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectImd(scope.row)"
                >Search</el-button
              >
            </template>
          </el-table-column>
         
        </el-table>
      </div>
      <!-- 明细查询展示 -->
      <div class="right-div" style="margin-left: 350px">
        <el-table
        border
          :data="ImdVO"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-class-name="tableRowClassName"
        >
         <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column
            prop="patientBillId"
            label="Bill ID"
            width="65"

          >
          </el-table-column>
           
          <el-table-column prop="patientId" label="Patient ID" width="70">
          </el-table-column>
          
          <el-table-column prop="patientName" label="Name" width="90" >
          </el-table-column>
          <el-table-column prop="gender" label="Gender" width="80" >
            <template slot-scope="scope">
              <el-tag :type="scope.row.gender === 1 ? ' ' : 'danger'" disable-transitions>
                {{ scope.row.gender === 1 ? 'Male' : 'Female' }}</el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="Unit" width="100" sortable>
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="Doctor"
            width="95"

          >

          </el-table-column>
          <el-table-column
            prop="drugCode"
            label="Drug Tag"
            width="85"

          >
          </el-table-column>
          <el-table-column
            prop="treatmentName"
            label="Drug Name"
            width="185"

          >
          </el-table-column>
          <el-table-column prop="drugCount" label="Number" width="100px" sortable>
          </el-table-column>
          <el-table-column
            prop="specification"
            label="Specification"
            width="140px"

          >
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="Order Date"

            sortable
          >
          </el-table-column>
          
            
        </el-table>
         <div style="margin-top: 20px">
      
            <el-button
              type="success" 
              plain
              class="el-icon-s-promotion"
              @click="imd"
              >Confirm</el-button
            >
          
        <el-button @click="toggleSelection()">Cancel</el-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      TreatmentDTO: {},
      ImdDTOs: {
        orderDate: new Date().toISOString().split('T')[0],
        orderDate1: new Date().toISOString().split('T')[0],
      },  //汇总查询往后端传条件
     ImdDTO:{},//查询明细往后端传条件
      ImdVOs: [],//接收汇总
      ImdVO: [],//接收明细
      ImdVOss: [],//往后端传明细
    };
  },
  created() {},
  methods: {
     //批量发药选择和取参
    handleSelectionChange(val) {
      this.ImdVOss = val;
      console.log(this.ImdVOss);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          if (!this.$refs.multipleTable.isSelected(row)) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
     //批量发药事件
    imd() {
      this.$confirm("Verify Complete，Dispense Confirm", "", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "success",
      })
        .then(() => {
          this.$axios
            .post("http://localhost/treatment/imd",this.ImdVOss)
            .then((resp) => {
              if (resp.data.code == 200) {
                this.$message({
                  message: "Dispense Complete!",
                  type: "success",
                });
                this.selectImd(this.ImdDTO);
                this.selectPatientByImd();
                this.ImdDTOs = {};
                this.ImdDTO = {};
              }
              
              this.ImdVOss= [];
            });
        })
        .catch(() => {
           this.ImdVOss= [];
        });
    },
    //汇总 查询出需要发药的患者名称和ID
    selectPatientByImd() {
      this.$axios
        .post("http://localhost/treatment/selectPatientByImd", this.ImdDTOs)
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
    selectImd(row) {
      this.ImdDTO = row;
      console.log(this.ImdDTO);
      this.$axios
        .post("http://localhost/treatment/selectImd", this.ImdDTO)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.ImdVO = resp.data.data;
           // this.ImdDTO = {};
          } else {
            //this.ImdDTO = {};
          }
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
  },
};
</script>
