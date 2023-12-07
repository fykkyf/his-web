<template>
  <div>
    <div>
      <el-form ref="form" :model="TreatmentDTO" label-width="100px">
        <el-col :span="7">
          <el-form-item label="开始日期">
            <el-date-picker v-model="TreatmentDTO.expiredTime" type="date" value-format="yyyy-MM-dd" placeholder="过期日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="截止日期">
            <el-date-picker v-model="TreatmentDTO.expiredTime1" type="date" value-format="yyyy-MM-dd" placeholder="过期日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="国家药品编号">
            <el-input v-model="TreatmentDTO.drugCode" placeholder="国家药品编号"></el-input>
          </el-form-item>

          <el-form-item label="厂家/名称">
            <el-input v-model="TreatmentDTO.keyword" placeholder="厂家/名称关键字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="库存">
            <el-input v-model="TreatmentDTO.storage" placeholder="数量"></el-input>
          </el-form-item>

          <el-form-item label="启用状态">
            <el-radio v-model="TreatmentDTO.treatmentStatus" label="1">启用</el-radio>
            <el-radio v-model="TreatmentDTO.treatmentStatus" label="2">停用</el-radio>
            <el-radio v-model="TreatmentDTO.treatmentStatus" label="null">不限</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="">
            <el-button type="success" plain class="el-icon-circle-plus-outline"
              @click="toaddTreatment1 = true">新增药品</el-button>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="selectAllTreatment1">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <!-- 列表展示 -->
    <div>
      <el-table border :data="TreatmentVO" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column prop="treatmentId" label="项目编号" width="50" sortable>
        </el-table-column>
        <el-table-column prop="drugCode" label="国家药品编号" width="90" sortable>
        </el-table-column>
        <el-table-column prop="treatmentName" label="药品名称" width="150" sortable>
        </el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家" width="140" sortable>
        </el-table-column>
        <el-table-column prop="productionTime" label="生产日期" width="100" sortable>
        </el-table-column>
        <el-table-column prop="expiredTime" label="过期日期" width="100" sortable>
        </el-table-column>
        <el-table-column prop="storage" label="库存" width="50" sortable>
        </el-table-column>
        <el-table-column prop="specification" label="规格" width="100" sortable>
        </el-table-column>
        <el-table-column prop="treatmentPrice" label="实际价格(元)" width="70" sortable>
        </el-table-column>
        <el-table-column prop="insurancePrice" label="医保价格(元)" width="70" sortable>
        </el-table-column>
        <el-table-column label="启用状态" width="70">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.treatmentStatus" active-color="#13ce66" inactive-color="#ff4949" :active-value=1
              :inactive-value=2 @change="updateTreatmentqy(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="基本信息操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="to_reduceStorage(scope.row);">出库</el-button>
            <el-button type="success" size="small" @click="to_warehousing(scope.row)">入库</el-button>
            <el-button type="warning" size="small" @click="to_updateTreatment(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页查询 -->
    <div>
      <el-pagination @size-change="changeSize" @current-change="changeNum" :current-page="TreatmentDTO.pageNum"
        :page-sizes="[2, 10, 15, 20, 25]" :page-size="TreatmentDTO.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 药品出库 -->
    <div>
      <el-dialog title="入库信息" :visible.sync="toreduceStorage">
        <el-form ref="form" :model="TreatmentDTOs1" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="TreatmentDTOs1.treatmentName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="出库数量">
            <el-input v-model="TreatmentDTOs1.storage1"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="reduceStorage">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 药品入库 -->
    <div>
      <el-dialog title="出库信息" :visible.sync="towarehousing">
        <el-form ref="form" :model="TreatmentDTOs2" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="TreatmentDTOs2.treatmentName" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="入库数量">
            <el-input v-model="TreatmentDTOs2.storage1"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="warehousing">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 药品修改 -->
    <div>
      <el-dialog title="药品信息" :visible.sync="toupdateTreatment1">
        <el-form ref="form" :model="TreatmentDTOs3" label-width="100px">
          <el-form-item label="项目编号">
            <el-input v-model="TreatmentDTOs3.treatmentId" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="国家药品编号">
            <el-input v-model="TreatmentDTOs3.drugCode"></el-input>
          </el-form-item>

          <el-form-item label="药品名称">
            <el-input v-model="TreatmentDTOs3.treatmentName"></el-input>
          </el-form-item>

          <el-form-item label="生产厂家">

            <el-input v-model="TreatmentDTOs3.manufacturer"></el-input>
          </el-form-item>

          <el-form-item label="生产日期">
            <el-date-picker v-model="TreatmentDTOs3.productionTime" type="date" value-format="yyyy-MM-dd"
              placeholder="生产日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="过期日期">
            <el-date-picker v-model="TreatmentDTOs3.expiredTime" type="date" value-format="yyyy-MM-dd" placeholder="过期日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="库存">
            <el-input v-model="TreatmentDTOs3.storage"></el-input>
          </el-form-item>

          <el-form-item label="规格">
            <el-input v-model="TreatmentDTOs3.specification"></el-input>
          </el-form-item>

          <el-form-item label="实际价格">
            <el-input v-model="TreatmentDTOs3.treatmentPrice"></el-input>
          </el-form-item>

          <el-form-item label="医保价格">
            <el-input v-model="TreatmentDTOs3.insurancePrice"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel3">取 消</el-button>
          <el-button type="primary" @click="updateTreatment1">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 新增药品 -->
    <div>
      <el-dialog title="药品信息" :visible.sync="toaddTreatment1">
        <el-form ref="form" :model="TreatmentDTOs4" :rules="rules" label-width="100px">

          <el-form-item label="国家药品编号" prop="drugCode">
            <el-input v-model="TreatmentDTOs4.drugCode"></el-input>
          </el-form-item>

          <el-form-item label="药品名称" prop="treatmentName">
            <el-input v-model="TreatmentDTOs4.treatmentName"></el-input>
          </el-form-item>

          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input v-model="TreatmentDTOs4.manufacturer"></el-input>
          </el-form-item>

          <el-form-item label="生产日期" prop="productionTime">
            <el-date-picker v-model="TreatmentDTOs4.productionTime" type="date" value-format="yyyy-MM-dd"
              placeholder="生产日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="过期日期" prop="expiredTime">
            <el-date-picker v-model="TreatmentDTOs4.expiredTime" type="date" value-format="yyyy-MM-dd" placeholder="过期日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="数量" prop="storage">
            <el-input v-model="TreatmentDTOs4.storage"></el-input>
          </el-form-item>

          <el-form-item label="规格" prop="specification">
            <el-input v-model="TreatmentDTOs4.specification"></el-input>
          </el-form-item>

          <el-form-item label="实际价格" prop="treatmentPrice">
            <el-input v-model="TreatmentDTOs4.treatmentPrice"></el-input>
          </el-form-item>

          <el-form-item label="医保价格" prop="insurancePrice">
            <el-input v-model="TreatmentDTOs4.insurancePrice"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel4">取 消</el-button>
          <el-button type="primary" @click="addTreatment1('form')">确 定</el-button>

        </div>
      </el-dialog>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      // 日期校验
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      rules: {
        drugCode: [{ required: true, message: "国家药品编号", trigger: "blur" }],
        treatmentName: [{ required: true, message: "药品名称", trigger: "blur" }],
        manufacturer: [{ required: true, message: "生产厂家", trigger: "blur" }],
        productionTime: [{ required: true, message: "生产日期", trigger: "change" }],
        expiredTime: [{ required: true, message: "过期日期", trigger: "change" }],
        storage: [{ required: true, message: "数量", trigger: "blur" }],
        specification: [{ required: true, message: "规格", trigger: "blur" }],
        insurancePrice: [{ required: true, message: "医保价格", trigger: "blur" }],
      },

      toreduceStorage: false, //出库
      towarehousing: false,  //入库
      toaddTreatment1: false,//新增
      toupdateTreatment1: false,//修改

      total: null,
      TreatmentDTO: {
        pageSize: 2,
        pageNum: 1,
      },//查询提交条件
      TreatmentVO: [],
      // treatmentStatus: "",
      //接收查询结果
      TreatmentDTOs: {},//更改启用状态 提交条件
      TreatmentDTOs1: {},//药品出库往后端传参
      TreatmentDTOs2: {},//药品入库
      TreatmentDTOs3: {},//药品修改
      TreatmentDTOs4: {},//药品新增
      GqDTO:{},
    };
  },
  created() { 
    this.selectAllTreatment2();
    this.selectAllTreatment3();
  },
  methods: {
    //库存警告
    selectAllTreatment2() {
      this.$axios.post("http://localhost/treatment/selectAllTreatment2", this.TreatmentDTO).then(resp => {
        if (resp.data.code == 200) {
          this.$message.warning(resp.data.data)
        } else {

        }
      })
    },
    //过期警告
    selectAllTreatment3() {
      this.GqDTO = {expiredTime:new Date().toISOString().split('T')[0],}
      this.$axios.post("http://localhost/treatment/selectAllTreatment3", this.GqDTO).then(resp => {
        console.log(resp.data.data)
        if (resp.data.code == 200) {
          this.GqDTO={};
          this.$message.warning(resp.data.data)
        } else {

        }
      })
    },
    //新增取消
    cancel4() {
      this.TreatmentDTOs4 = {};
      this.toaddTreatment1 = false;
    },
    //修改取消
    cancel3() {
      this.TreatmentDTOs3 = {};
      this.toupdateTreatment1 = false;
    },
    //入库取消
    cancel2() {
      this.TreatmentDTOs2 = {};
      this.towarehousing = false;
    },
    //出库取消
    cancel1() {
      this.TreatmentDTOs1 = {};
      this.toreduceStorage = false;
    },
    //修改  
    to_updateTreatment(obj) {
      this.TreatmentDTOs3 = obj;
      this.toupdateTreatment1 = true;
    },
    //出库  
    to_reduceStorage(obj) {
      this.TreatmentDTOs1 = obj;
      this.toreduceStorage = true;
    },
    //入库
    to_warehousing(obj) {
      this.TreatmentDTOs2 = obj;
      this.towarehousing = true;
    },
    changeValue() {
      this.TreatmentDTO.pageNum = 1;
      this.selectAllTreatment1();
    },
    changeSize(size) {
      this.TreatmentDTO.pageSize = size;
      this.TreatmentDTO.pageNum = 1;
      this.selectAllTreatment1();
    },
    changeNum(pageNum) {
      this.TreatmentDTO.pageNum = pageNum;
      this.selectAllTreatment1();
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
    //条件查询  查出所有药品
    selectAllTreatment1() {
      this.$axios
        .post(
          "http://localhost/treatment/selectAllTreatment1",
          this.TreatmentDTO
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            console.log(resp.data.data)
            this.TreatmentVO = resp.data.data.list;
            this.total = resp.data.data.total;
            console.log(this.TreatmentVO);
          } else {
          }
        });
    },
    //修改药品启用状态
    updateTreatmentqy(row) {
      this.TreatmentDTOs = row;
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
      this.TreatmentDTOs = {};
    },
    //药品出库
    reduceStorage() {
      this.$axios
        .post(
          "http://localhost/treatment/reduceStorage",
          this.TreatmentDTOs1
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.toreduceStorage = false;
            this.TreatmentDTOs1 = {};
            this.selectAllTreatment1();
          } else {
          }
        });
      this.toreduceStorage = false;
      this.TreatmentDTOs1 = {};
      this.selectAllTreatment1();
    },
    //药品入库
    warehousing() {
      this.$axios
        .post(
          "http://localhost/treatment/warehousing",
          this.TreatmentDTOs2
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.towarehousing = false;
            this.TreatmentDTOs2 = {};
            this.selectAllTreatment1();
          } else {
          }
        });
      this.towarehousing = false;
      this.TreatmentDTOs2 = {};
      this.selectAllTreatment1();
    },
    //药品修改
    updateTreatment1() {
      this.$axios
        .post(
          "http://localhost/treatment/updateTreatment",
          this.TreatmentDTOs3
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.toupdateTreatment1 = false;
            this.TreatmentDTOs3 = {};
            this.selectAllTreatment1();
          } else {

          }
        });
      this.toupdateTreatment = false;
      this.TreatmentDTOs3 = {};
      this.selectAllTreatment1();
    },
    //新增药品
    addTreatment1() {
      this.$axios
        .post(
          "http://localhost/treatment/addTreatment1",
          this.TreatmentDTOs4
        )
        .then((resp) => {
          if (resp.data.code == 200) {
            this.TreatmentDTOs4 = {};
            this.selectAllTreatment1();
          } else {
          }
        });
      //this.addTreatment1=false;
      this.TreatmentDTOs4 = {};
      this.selectAllTreatment1();
    },
  },
};
</script>

<style></style>