<template>
  <!-- 门诊发药 -->
  <div>
    <!-- 查询条件 -->
    <div>
      <el-form ref="form" :model="OmdDTOs" label-width="100px">
        <el-col :span="6">
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="OmdDTOs.orderDate"
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
              v-model="OmdDTOs.orderDate1"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="下达日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="门诊号">
            <el-input
              v-model="OmdDTOs.visitorId"
              placeholder="门诊号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="selectVisitorByOmd"
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
        
          <el-table-column prop="visitorId" label="就诊号" width="60" sortable>
          </el-table-column>
          
          <el-table-column prop="visitorName" label="姓名" width="65" sortable>
          </el-table-column>
          
          <el-table-column  label="门诊发药操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="selectOmd(scope.row)"
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
          :data="OmdVO"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :row-class-name="tableRowClassName"
        >
         <el-table-column type="selection" width="30"> </el-table-column>
          <el-table-column
            prop="visitorBillId"
            label="费用编号"
            width="70"
            sortable
          >
          </el-table-column>
           
          <el-table-column prop="visitorId" label="门诊号" width="50" sortable>
          </el-table-column>
          
          <el-table-column prop="visitorName" label="姓名" width="100" sortable>
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
              @click="omd"
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
      this.$confirm("核对完毕，确认发药？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      })
        .then(() => {
          console.log(this.eids);
          this.$axios
            .post("http://localhost/treatment/omd",this.OmdVOss)
            .then((resp) => {
              if (resp.data.code == 200) {
                this.$message({
                  message: "发药完成!",
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