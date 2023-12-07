<template >
  <div>
<!--    //查询-->
    <el-form :inline="true"  style="float: left">
      <el-form-item label="住院号" style="font-weight: bold;">
        <el-input v-model="patientId" placeholder="住院号" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPatientBillByPatientId(patientId)">查询</el-button>
      </el-form-item>
    </el-form>
    <br><br><br>
<!--    //病人信息-->

    <el-descriptions class="margin-top" title="患者信息" :column="3"  border
                     :data="patientBillResultVO.patientInfo" >
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          住院号
        </template>
        {{patientBillResultVO.patientInfo.patientId}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名
        </template>
        {{patientBillResultVO.patientInfo.patientName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          年龄
        </template>
        {{patientBillResultVO.patientInfo.age}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-coordinate"></i>
          身份证号
        </template>
        {{patientBillResultVO.patientInfo.idNumber}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          性别
        </template>
        <template>
          <span v-if="patientBillResultVO.patientInfo.gender == 0">女</span>
          <span v-else-if="patientBillResultVO.patientInfo.gender == 1">男</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          缴费类型
        </template>
        <template>
          <span v-if="patientBillResultVO.patientInfo.insuranceStatus == 1">自费</span>
          <span v-else-if="patientBillResultVO.patientInfo.insuranceStatus == 2">医保</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          科室
        </template>
        {{patientBillResultVO.patientInfo.unit.unitName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-service"></i>
          医生
        </template>
        {{patientBillResultVO.patientInfo.employee.employeeName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-search"></i>
          出院诊断
        </template>
        {{patientBillResultVO.patientInfo.dischargeDiagnosis.diseaseName}}
      </el-descriptions-item>
    </el-descriptions>
<!--    //具体医嘱项目明细-->
    <br>
    <span style="float: left; font-weight: bold;" font-family="微软雅黑" >费用明细 </span>
    <el-table title="价格明细" :data="patientBillResultVO.patientBillVOList" style="width: 100%" border>
      <el-table-column
          prop="patientBillId"
          label="费用单号">
      </el-table-column>
      <el-table-column
          prop="treatmentName"
          label="医疗项目名称">
      </el-table-column>
      <el-table-column
          prop="drugCount"
          label="项目数目">
      </el-table-column>
      <el-table-column
          prop="treatmentPrice"
          label="实际价格">
      </el-table-column>
      <el-table-column
          prop="insurancePrice"
          label="医保价格">
      </el-table-column>
      <el-table-column
          prop="finalPrice"
          label="支付金额">
      </el-table-column>
<!--      <el-table-column-->
<!--          fixed="right"-->
<!--          label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" :disabled="scope.row.paystatus" @click="paymentStatus(scope.row)">-->
<!--            <span v-if="scope.row.paystatus">已支付</span>-->
<!--            <span v-else>支付</span>-->

<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-button type="primary" @click="ConfirmPayment(patientId)" style="float: right">
      支付</el-button>

    <el-dialog
        title="缴费"
        :visible.sync="show"
        width="30%"
        :before-close="handleClose">
      <span>缴费金额为：{{patientBillResultVO.finalPrice}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click="paymentStatus(patientId)">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>



export default {

  data(){

    return{
      patientId:'',
      patientBillResultVO:{
        patientBillVOList:[],
        patientInfo:{

          patientName:'',
          age:'',
          idNumber:'',
          gender:'6',
          insuranceStatus:'',
          unit:{
            unitName:''
          },
          dischargeDiagnosis:{
            diseaseName:''
          },
          employee:{
            employeeName:'',
          },
        },
        finalPrice:'',
      },

      patientBillVO:{},
      paystatus: false,
      price:'',
      show: false,


    };
  },
  methods:{

    getPatientBillByPatientId(patientId) {

      this.$axios.get("http://localhost/patientBill/getPatientBill/"+patientId).then((res) => {
        this.patientBillResultVO = res.data.data;

      });
    },
    paymentStatus(patientId) {
      this.$axios
          .post("http://localhost/patientBill/chengeAllPaymentStatus/" + patientId)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "支付成功",
                type: "success",
              });
              this.patientBillVOList = [];
            }
          });

      this.show = false;
    },
    ConfirmPayment(patientId){
      this.patientId = patientId;
      this.show = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },



  },

  created() {
    //this.getAll();
  },
}
</script>


<style scoped>
.el-form {
  line-height: 40px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
}
</style>
