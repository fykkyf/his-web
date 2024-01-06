<template >
  <div>
    <!--    //查询-->
    <el-form :inline="true" style="float: left">
      <el-form-item label="Visitor ID" style="font-weight: bold;">
        <el-input v-model="visitorId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getVisitorBillByVisitorId(visitorId)" :disabled="isSearchButtonDisabled">Search</el-button>
      </el-form-item>
    </el-form>
    <br><br><br>
    <!--    //病人信息-->


    <el-descriptions class="margin-top" title="Patient Information" :column="3"  border
                     :data="visitorBillResultVO.visitorInfo" >
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          ID
        </template>
        {{visitorBillResultVO.visitorInfo.visitorId}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          Name
        </template>
        {{visitorBillResultVO.visitorInfo.visitorName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          Age
        </template>
        {{visitorBillResultVO.visitorInfo.age}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-coordinate"></i>
          DL#
        </template>
        {{visitorBillResultVO.visitorInfo.idNumber}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          Gender
        </template>
        <template>
          <span v-if="visitorBillResultVO.visitorInfo.gender == 2">Female</span>
          <span v-else-if="visitorBillResultVO.visitorInfo.gender == 1">Male</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-phone"></i>
          Phone#
        </template>
        {{visitorBillResultVO.visitorInfo.phone}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          Unit
        </template>
        {{visitorBillResultVO.visitorInfo.unit.unitName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-service"></i>
          Physician
        </template>
        {{visitorBillResultVO.visitorInfo.employee.employeeName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-search"></i>
          Diagnosis
        </template>
        {{visitorBillResultVO.visitorInfo.clinicDiagnosis.diseaseName}}
      </el-descriptions-item>
    </el-descriptions>
    <!--    //具体医嘱项目明细-->
    <br>
    <span style="float: left; font-weight: bold;" font-family="微软雅黑" >Billing Details </span>
    <el-table title="价格明细" :data="visitorBillResultVO.visitorBillVOList" style="width: 100%" border>
      <el-table-column
          prop="visitorBillId"
          label="Bill ID">
      </el-table-column>

      <el-table-column
          prop="treatmentName"
          label="Treatment Name">
      </el-table-column>
      <el-table-column
          prop="drugCount"
          label="Number of Treatment">
      </el-table-column>

      <el-table-column
          prop="treatmentPrice"
          label="Price">
      </el-table-column>
      <el-table-column
          prop="finalPrice"
          label="Actual Price">
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="ConfirmPayment(visitorId)" style="float: right">
      Pay Bill</el-button>

    <el-dialog
        title="Bill"
        :visible.sync="show"
        width="30%"
        :before-close="handleClose">
      <span>The Payment amount is：${{visitorBillResultVO.finalPrice}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">Cancel</el-button>
    <el-button type="primary" @click="paymentStatus(visitorId)">Submit</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>



export default {

  data(){
    return{
      visitorBillResultVO:{
        visitorBillVOList:[],
        visitorInfo:{
          visitorId:'',
          visitorName:'',
          age:'',
          idNumber:'',
          gender:'6',
          phone:'',
          unit:{
            unitName:''
          },
          clinicDiagnosis:{
            diseaseName:''
          },
          employee:{
            employeeName:'',
          },
          paymentStatus:'',
        },
        finalPrice:'',
      },
      visitorId:'',
      visitorBillVO:{},
      buttonStatus:false,

      price:'',
      show: false,

    };
  },
  computed: {
    isSearchButtonDisabled() {
      return !this.visitorId; // 禁用按钮如果patientId为空
    }
  },
  methods:{
    getVisitorBillByVisitorId(visitorId) {
      this.$axios.get("http://localhost/visitorBill/getBillByVisitorId/"+visitorId).then((res) => {
        if(res.data.code == 200){
          this.visitorBillResultVO = res.data.data;
          console.log( res.data.data);

        }else {
          this.$message(res.data.data);
          this.visitorId='';
        }

      });
    },
    paymentStatus(visitorId) {
      this.$axios
          .post("http://localhost/visitorBill/changeAllStatus/" + visitorId)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "success",
                type: "success",
              });
              this.visitorBillResultVO = {};
              this.visitorId='';
            }
          });

      this.show = false;
    },
    ConfirmPayment(visitorId){
      this.visitorId = visitorId;
      this.show = true;
    },
    handleClose(done) {
      this.$confirm('Close？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    }

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
