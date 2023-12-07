<template >
  <div>
    <!--    //查询-->
    <el-form :inline="true" style="float: left">
      <el-form-item label="挂号单号" style="font-weight: bold;">
        <el-input v-model="visitorId" placeholder="单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getVisitorBillByVisitorId(visitorId)">查询</el-button>
      </el-form-item>
    </el-form>
    <br><br><br>
    <!--    //病人信息-->


    <el-descriptions class="margin-top" title="患者信息" :column="3"  border
                     :data="visitorBillResultVO.visitorInfo" >
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          住院号
        </template>
        {{visitorBillResultVO.visitorInfo.visitorId}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{visitorBillResultVO.visitorInfo.visitorName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          年龄
        </template>
        {{visitorBillResultVO.visitorInfo.age}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-coordinate"></i>
          身份证号
        </template>
        {{visitorBillResultVO.visitorInfo.idNumber}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          性别
        </template>
        <template>
          <span v-if="visitorBillResultVO.visitorInfo.gender == 0">女</span>
          <span v-else-if="visitorBillResultVO.visitorInfo.gender == 1">男</span>
          <span v-else></span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-phone"></i>
          手机号
        </template>
        {{visitorBillResultVO.visitorInfo.phone}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          科室
        </template>
        {{visitorBillResultVO.visitorInfo.unit.unitName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-service"></i>
          医生
        </template>
        {{visitorBillResultVO.visitorInfo.employee.employeeName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-search"></i>
          疾病
        </template>
        {{visitorBillResultVO.visitorInfo.clinicDiagnosis.diseaseName}}
      </el-descriptions-item>
    </el-descriptions>
    <!--    //具体医嘱项目明细-->
    <br>
    <span style="float: left; font-weight: bold;" font-family="微软雅黑" >价格明细 </span>
    <el-table title="价格明细" :data="visitorBillResultVO.visitorBillVOList" style="width: 100%" border>
      <el-table-column
          prop="visitorBillId"
          label="挂号单号">
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
          label="项目金额">
      </el-table-column>
      <el-table-column
          prop="finalPrice"
          label="支付金额">
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="ConfirmPayment(visitorId)" style="float: right">
      支付</el-button>

    <el-dialog
        title="缴费"
        :visible.sync="show"
        width="30%"
        :before-close="handleClose">
      <span>缴费金额为：{{visitorBillResultVO.finalPrice}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click="paymentStatus(visitorId)">确 定</el-button>
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
  methods:{
    getVisitorBillByVisitorId(visitorId) {
      this.$axios.get("http://localhost/visitorBill/getBillByVisitorId/"+visitorId).then((res) => {
        this.visitorBillResultVO = res.data.data;
        console.log( res.data.data)
      });
    },
    paymentStatus(visitorId) {
      this.$axios
          .post("http://localhost/visitorBill/changeAllStatus/" + visitorId)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "支付成功",
                type: "success",
              });
              this.visitorBillResultVO = {};
            }
          });

      this.show = false;
    },
    ConfirmPayment(visitorId){
      this.visitorId = visitorId;
      this.show = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
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
