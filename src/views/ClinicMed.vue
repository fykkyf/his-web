<template>
  <!-- 门诊发药 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="OmdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="OmdDTOs.orderDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="End Date">
            <el-date-picker
              v-model="OmdDTOs.orderDate1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder=""
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
              @click="selectVisitorByOmd"
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
              @click="omd"
              >确认发药</el-button
            >
          </el-form-item> -->
        </el-col>
      </el-form>
    </div>
    <div>
      <!-- 汇总查询展示 -->
      <div style="width: 20%">
        <el-table
          :data="OmdVOs"
          
          :row-class-name="tableRowClassName"
        >
        
          <el-table-column prop="visitorId" label="ID" width="55" >
          </el-table-column>
          
          <el-table-column prop="visitorName" label="Name" >
          </el-table-column>
          
          <el-table-column  label="Operation">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectOmd(scope.row)"
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
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-class-name="tableRowClassName"
        >
         <el-table-column type="selection" width="35">

         </el-table-column>
          <el-table-column
            prop="visitorBillId"
            label="Bill ID"
            width="65"

          >
          </el-table-column>
           
          <el-table-column prop="visitorId" label="Visit ID" width="70">
          </el-table-column>
          
          <el-table-column prop="visitorName" label="Name" width="90" >
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
            label="Physician"
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
          <el-table-column prop="drugCount" label="Number" width="100" sortable>
          </el-table-column>
          <el-table-column
            prop="specification"
            label="specification"
            width="130"

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
              @click="omd"
              >Dispense</el-button
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
      OmdDTOs: {
        orderDate: new Date().toISOString().split('T')[0],
        orderDate1: new Date().toISOString().split('T')[0],
      },//汇总查询往后端传条件 
      OmdDTO:{},//查询明细往后端传条件
      OmdVOs: [],//接收汇总
      OmdVO: [],//接收明细
      OmdVOss: [],//往后端传明细
    };
  },
  created() {},
  methods: {
     //批量发药选择和取参
    handleSelectionChange(val) {
      this.OmdVOss = val;
      console.log(this.OmdVOss);
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
    omd() {
      this.$confirm("Verify Complete，Confirm Despense", "", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "success",
      })
        .then(() => {
          console.log(this.eids);
          this.$axios
            .post("http://localhost/treatment/omd",this.OmdVOss)
            .then((resp) => {
              if (resp.data.code == 200) {
                this.$message({
                  message: "Dispense Complete!",
                  type: "success",
                });
                this.selectVisitorByOmd();
                this.selectOmd(this.OmdDTO);
                this.OmdDTO={};
                this.OmdDTOs={};
              }
              this.OmdVOss= [];
            });
        })
        .catch(() => {
           this.OmdVOss= [];
        });
    },
    //汇总 查询出需要发药的患者名称和ID
    selectVisitorByOmd() {
      this.$axios
        .post("http://localhost/treatment/selectVisitorByOmd", this.OmdDTOs)
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
    selectOmd(row) {
      this.OmdDTO = row;
      console.log(this.OmdDTO);
      this.$axios
        .post("http://localhost/treatment/selectOmd", this.OmdDTO)
        .then((resp) => {
          if (resp.data.code == 200) {
            this.OmdVO = resp.data.data;
           // this.OmdDTO = {};
          } else {
           // this.OmdDTO = {};
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