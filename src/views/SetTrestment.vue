<template>
  <div>

      <el-form ref="form" :model="TreatmentDTO" >
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8" >
            <el-form-item label="Name" >
              <el-input v-model="TreatmentDTO.keyword" placeholder="Keyword" style="width: 400px"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Status">
              <el-radio v-model="TreatmentDTO.treatmentStatus" label="1"
                >Enable</el-radio
              >
              <el-radio v-model="TreatmentDTO.treatmentStatus" label="2"
                >Disable</el-radio
              >
              <el-radio v-model="TreatmentDTO.treatmentStatus" label="null"
                >Unlimited</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Type:">
              <el-select v-model="TreatmentDTO.treatmentCategory" clearable  placeholder="">
                <el-option label="Treatment" value="2"></el-option>
                <el-option label="Lab Test" value="3"></el-option>
                <el-option label="Radiology" value="4"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-button type="success" plain class="el-icon-circle-plus-outline" @click="toaddTreatment1=true">新增项目</el-button>
              <el-button type="primary" icon="el-icon-search" @click="selectAllTreatment">查询</el-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

    
    <!-- 列表展示 -->

      <el-table
        :data="TreatmentVO"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="treatmentId"
          label="项目编号"
          width="100"
          sortable
        >
       
        </el-table-column>
        <el-table-column
          prop="treatmentName"
          label="项目名称"

          sortable
        >
        </el-table-column>
     
       
        <el-table-column
          prop="treatmentPrice"
          label="实际价格(元)"

          sortable
        >
        </el-table-column>
        <el-table-column
          prop="insurancePrice"
          label="医保价格(元)"

          sortable
        >
        </el-table-column>
        <el-table-column label="启用状态"  >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.treatmentStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value=1
              :inactive-value=2
              @change="updateTreatmentqy(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="基本信息操作">
          <template slot-scope="scope">
    
            <el-button type="warning" size="small" @click="to_updateTreatment(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="changeSize"
        @current-change="changeNum"
        :current-page="TreatmentDTO.pageNum"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="TreatmentDTO.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>



     <!-- 项目修改 -->

         <el-dialog title="项目信息" :visible.sync="toupdateTreatment1">
          <el-form ref="form" :model="TreatmentDTOs3" label-width="100px" >
              <el-form-item label="项目编号" >
                  <el-input v-model="TreatmentDTOs3.treatmentId" :disabled="true"></el-input>
              </el-form-item>

               <el-form-item label="项目编号" >
                  <el-input v-model="TreatmentDTOs3.treatmentName" ></el-input>
              </el-form-item>

              <el-form-item label="实际价格">
                  <el-input v-model="TreatmentDTOs3.treatmentPrice"></el-input>
              </el-form-item>
            
              <el-form-item label="医保价格">
                  <el-input v-model="TreatmentDTOs3.insurancePrice"></el-input>
              </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="cancel3" >取 消</el-button>
              <el-button type="primary" @click="updateTreatment1">确 定</el-button>
          </div>
      </el-dialog>


     <!-- 新增项目 -->

         <el-dialog title="项目信息" :visible.sync="toaddTreatment1">
          <el-form ref="form" :model="TreatmentDTOs4" :rules="rules" label-width="100px">

                <el-form-item label="项目类型" prop="treatmentCategory">
                 <el-select v-model="TreatmentDTOs4.treatmentCategory" clearable  placeholder="请选择类型"
                                   >
                                    <el-option label="诊疗" value="2"></el-option>
                                    <el-option label="检验" value="3"></el-option>
                                    <el-option label="检查" value="4"></el-option>
                                </el-select>
              </el-form-item>
              
               <el-form-item label="项目名称" prop="treatmentName">
                  <el-input v-model="TreatmentDTOs4.treatmentName"></el-input>
              </el-form-item>

              <el-form-item label="实际价格" prop="treatmentPrice">
                  <el-input v-model="TreatmentDTOs4.treatmentPrice"></el-input>
              </el-form-item>
            
              <el-form-item label="医保价格" prop="insurancePrice">
                  <el-input v-model="TreatmentDTOs4.insurancePrice"></el-input>
              </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
             <el-button @click="cancel4" >取 消</el-button>
              <el-button type="primary" @click="addTreatment1('form')">确 定</el-button>
              
          </div>
      </el-dialog>



  </div>
</template>

<script>
export default {
  data() {
    return {
        rules: {
          treatmentCategory: [{ required: true, message: "项目类型", trigger: "blur" }],
        treatmentName: [{ required: true, message: "项目名称", trigger: "blur" } ],
          treatmentPrice: [{ required: true, message: "实际价格", trigger: "blur" }],
        insurancePrice: [{ required: true, message: "医保价格", trigger: "blur" }],
      },

     
      toaddTreatment1:false,//新增
      toupdateTreatment1:false,//修改
      
     total:null,
      TreatmentDTO: {
        pageSize: 10,
        pageNum: 1,
      },//查询提交条件
      TreatmentVO: [],
       // treatmentStatus: "",
      //接收查询结果
      TreatmentDTOs: {},//更改启用状态 提交条件
      TreatmentDTOs3:{},//药品修改
      TreatmentDTOs4:{},//药品新增
    };
  },
  created() {},
  methods: {
  
    //新增取消
    cancel4(){
      this.TreatmentDTOs4={};
      this.toaddTreatment1=false;
    },
    //修改取消
    cancel3(){
          this.TreatmentDTOs3={};
          this.toupdateTreatment1=false;
    },
   
    //修改  
    to_updateTreatment(obj){
          this.TreatmentDTOs3=obj;
          this.toupdateTreatment1=true;
    },
    changeValue() {
      this.TreatmentDTO.pageNum = 1;
      this.selectAllTreatment();
    },
    changeSize(size) {
      this.TreatmentDTO.pageSize = size;
      this.TreatmentDTO.pageNum = 1;
      this.selectAllTreatment();
    },
    changeNum(pageNum) {
      this.TreatmentDTO.pageNum = pageNum;
      this.selectAllTreatment();
    },
    //分页
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //条件查询  查出所有项目
    selectAllTreatment() {
      this.$axios
        .post(
          "http://localhost/treatment/selectAllTreatment",
          this.TreatmentDTO
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.TreatmentVO = resp.data.data.list;
            this.total = resp.data.data.total;
            console.log(this.TreatmentVO);
          } else {
          }
        });
    },
    //修改项目启用状态
    updateTreatmentqy(row) {
      this.TreatmentDTOs=row;
      this.$axios
        .post(
          "http://localhost/treatment/updateTreatment",
          this.TreatmentDTOs
        )
        .then((resp) => {
          if (resp.data.code == 200) {
               
          } else {
          }
        });
        this.TreatmentDTOs={};
    },
     //项目修改
    updateTreatment1() {
      this.$axios
        .post(
          "http://localhost/treatment/updateTreatment",
          this.TreatmentDTOs3
        )
        .then((resp) => {
          if (resp.data.code == 200) {
        this.toupdateTreatment1=false;
        this.TreatmentDTOs3={};
        this.selectAllTreatment();
          } else {

          }
        });
        this.toupdateTreatment=false;
        this.TreatmentDTOs3={};
        this.selectAllTreatment();
    },
       //新增项目
    addTreatment1() {
      this.$axios
        .post(
          "http://localhost/treatment/addTreatment",
          this.TreatmentDTOs4
        )
        .then((resp) => {
          if (resp.data.code == 200) {
              this.$message({
                                message:  resp.data.data,
                                type: "success"
                            })
                this.TreatmentDTOs4={};
                this.selectAllTreatment();
          } else {
            this.$message({
                    message: resp.data.data,
                    type: "error"
                            })
           this.TreatmentDTOs4={};
        this.selectAllTreatment();
          }
        });
    },
  },
};
</script>

<style>
</style>