<template >
  <div>
    <el-form :inline="true" style="float: left">
      <el-form-item label="Patient ID" style="font-weight: bold;" prop="patientId" >
        <el-input v-model="patientId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPatientBillByPatientId(patientId)" :disabled="isSearchButtonDisabled">Search</el-button>
      </el-form-item>
    </el-form>

    <br><br><br>
<!--    //病人信息-->

    <el-descriptions class="margin-top" title="Patient Information" :column="3"  border
                     :data="patientBillResultVO.patientInfo" >
      <el-descriptions-item>
        <template slot="label" >
          <i class="el-icon-s-custom"></i>
          Patient ID
        </template>
        {{patientBillResultVO.patientInfo.patientId}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label" >
          <i class="el-icon-user"></i>
          Patient Name
        </template>
        {{patientBillResultVO.patientInfo.patientName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          Patient Age
        </template>
        {{patientBillResultVO.patientInfo.age}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-coordinate"></i>
          Driver's License
        </template>
        {{patientBillResultVO.patientInfo.idNumber}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          Gender
        </template>
        <template>
          <span v-if="patientBillResultVO.patientInfo.gender == 0">Female</span>
          <span v-else-if="patientBillResultVO.patientInfo.gender == 1">Male</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          Payment Type
        </template>
        <template>
          <span v-if="patientBillResultVO.patientInfo.insuranceStatus == 1">Self-pay</span>
          <span v-else-if="patientBillResultVO.patientInfo.insuranceStatus == 2">Insurance</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          Unit
        </template>
        {{patientBillResultVO.patientInfo.unit.unitName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-service"></i>
          Physician
        </template>
        {{patientBillResultVO.patientInfo.employee.employeeName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-search"></i>
          Discharge Diagnosis
        </template>
        {{patientBillResultVO.patientInfo.dischargeDiagnosis.diseaseName}}
      </el-descriptions-item>
    </el-descriptions>
<!--    //具体医嘱项目明细-->
    <br>
    <span style="float: left; font-weight: bold;" font-family="微软雅黑" >Expense Details </span>
    <el-table title="Order Details" :data="patientBillResultVO.patientBillVOList" style="width: 100%" border>
      <el-table-column
          prop="patientBillId"
          label="Bill ID">
      </el-table-column>
      <el-table-column
          prop="treatmentName"
          label="Treatment">
      </el-table-column>
      <el-table-column
          prop="drugCount"
          label="Number">
      </el-table-column>
      <el-table-column
          prop="treatmentPrice"
          label="Price">
      </el-table-column>
      <el-table-column
          prop="insurancePrice"
          label="Insurance Price">
      </el-table-column>
      <el-table-column
          prop="finalPrice"
          label="Final Price">
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
      Pay Bill</el-button>

    <el-dialog
        title="Payment"
        :visible.sync="show"
        width="30%"
        :before-close="handleClose">
      <span>Total Bill Amount：${{patientBillResultVO.finalPrice}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">Cancel</el-button>
    <el-button type="primary" @click="paymentStatus(patientId)">Submit</el-button>
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
  computed: {
    isSearchButtonDisabled() {
      return !this.patientId; // 禁用按钮如果patientId为空
    }
  },
  methods:{

    getPatientBillByPatientId(patientId) {

      this.$axios.get("http://localhost/patientBill/getPatientBill/"+patientId).then((res) => {
        if (res.data.code ==200){
          this.patientBillResultVO = res.data.data;
          this.patientId = '';
        }else {
          this.$message(res.data.data);
          this.patientId='';
        }


      });
    },
    paymentStatus(patientId) {
      this.$axios
          .post("http://localhost/patientBill/chengeAllPaymentStatus/" + patientId)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "Payment Submit Success",
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
      this.$confirm('Confirm Close？')
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
