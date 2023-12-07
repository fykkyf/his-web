<template>
  <!-- 住院发药 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="ImdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="ImdDTOs.orderDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="下达日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="ImdDTOs.orderDate1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="下达日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="住院号">
            <el-input
              v-model="ImdDTOs.patientId"
              placeholder="住院号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="selectPatientByImd"
              >汇总查询</el-button
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
      <div style="width: 20%">
        <el-table
          :data="ImdVOs"
          
          :row-class-name="tableRowClassName"
        >
        
          <el-table-column prop="patientId" label="住院号" width="55" sortable>
          </el-table-column>
          
          <el-table-column prop="patientName" label="姓名" width="80" sortable>
          </el-table-column>
          
          <el-table-column  label="住院发药操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectImd(scope.row)"
                >查询发药</el-button
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
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-class-name="tableRowClassName"
        >
         <el-table-column type="selection" width="30"> </el-table-column>
          <el-table-column
            prop="patientBillId"
            label="费用编号"
            width="70"
            sortable
          >
          </el-table-column>
           
          <el-table-column prop="patientId" label="住院号" width="50" sortable>
          </el-table-column>
          
          <el-table-column prop="patientName" label="姓名" width="100" sortable>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="50" sortable>
            <template slot-scope="scope">
               {{ scope.row.gender === 1 ? '男' : '女' }}
                        </template>
          </el-table-column>
          <el-table-column prop="unitName" label="科室" width="70" sortable>
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="医生"
            width="70"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="drugCode"
            label="国家药品编号"
            width="100"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="treatmentName"
            label="药品名称"
            width="140"
            sortable
          >
          </el-table-column>
          <el-table-column prop="drugCount" label="数量" width="60" sortable>
          </el-table-column>
          <el-table-column
            prop="specification"
            label="规格"
            width="100"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="orderDate"
            label="下达时间"
            width="160"
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
              >确认发药</el-button
            >
          
        <el-button @click="toggleSelection()">取消选择</el-button>
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
      this.$confirm("核对完毕，确认发药？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      })
        .then(() => {
          this.$axios
            .post("http://localhost/treatment/imd",this.ImdVOss)
            .then((resp) => {
              if (resp.data.code == 200) {
                this.$message({
                  message: "发药完成!",
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