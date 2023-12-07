<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="7">
          就诊id:<el-input
            disabled
            v-model="visitorId"
            class="orderInput"
          ></el-input>
        </el-col>
        <el-col :span="7">
          患者姓名：<el-input
            disabled
            v-model="visitorName"
            class="orderInput"
          ></el-input
        ></el-col>
        <el-col :span="7">
          患者性别：<el-input
            disabled
            v-model="gender"
            class="orderInput"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="success" @click="submitClick" style="font-size: 18px"
            ><i class="iconfont icon-r-yes" style="font-size: 22px"></i>
            提交</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          联系方式：<el-input
            disabled
            v-model="phone"
            class="orderInput"
          ></el-input>
        </el-col>
        <el-col :span="7">
          就诊科室：<el-input
            disabled
            v-model="unitId"
            class="orderInput"
          ></el-input
        ></el-col>
        <el-col :span="7">
          医生姓名：<el-input
            disabled
            v-model="doctorId"
            class="orderInput"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="warning" @click="openReason" style="font-size: 18px"
            ><i class="iconfont icon-r-paper" style="font-size: 22px"></i>
            病因编写</el-button
          >
        </el-col>
      </el-row>
      <!-- 药物表格 -->
       <el-row>
        <el-col :span="12">
          <el-input
            v-model="queryDrug"
            placeholder="请输入名称查询"
            class="drugInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="requestDrug"
            ></el-button>
          </el-input>
           <el-table :data="treatment" stripe border>
            <el-table-column label="编号" prop="drug_code"></el-table-column>
            <el-table-column
              label="名称"
              prop="treatmentName"
            ></el-table-column>
            <el-table-column label="库存" prop="storage"></el-table-column>
            <el-table-column
              label="规格"
              prop="specification"
            ></el-table-column>
            <el-table-column
              label="单价"
              prop="treatmentPrice"
            ></el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  style="font-size: 14px"
                  @click="addDrug(scope.row.drug_code)"
                >
                  <i class="iconfont icon-r-add" style="font-size: 16px"></i>
                  增加</el-button
                >
              </template>
            </el-table-column>
          </el-table> 
          <!-- 分页 -->
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            layout="total, sizes, prev, pager, next"
            :total="total"
            :page-size="size"
            :page-sizes="[1, 2, 4, 8, 16]"
          >
          </el-pagination> -->
          <el-row></el-row>
        </el-col>
        <!-- 右边已选择的药物 -->
        <el-col :span="12" class="drugRigth">
          <el-table stripe border :data="drugBuyData" class="rigthTable">
            <el-table-column label="编号" prop="drId"></el-table-column>
            <el-table-column label="名称" prop="drName"></el-table-column>
            <el-table-column label="单价" prop="drPrice"></el-table-column>
            <el-table-column label="数量" prop="drNum"></el-table-column>
            <el-table-column label="小记" prop="drSum"></el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  style="font-size: 14px"
                  icon="iconfont icon-r-delete"
                  @click="deleteDrug(scope.row.drId)"
                >
                  移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-tag>共计：{{ drugTotalPrice }}元</el-tag>
        </el-col>
      </el-row>
      <!-- 检查项目编写 -->
      <!-- <el-row>
        <el-col :span="12">
          <el-input
            v-model="queryCheck"
            placeholder="请输入名称查询"
            class="drugInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="requestCheck"
            ></el-button>
          </el-input>
          <el-table stripe border :data="checkData">
            <el-table-column label="编号" prop="chId"></el-table-column>
            <el-table-column label="项目" prop="chName"></el-table-column>
            <el-table-column label="价格" prop="chPrice"></el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  style="font-size: 14px;"
                  icon="iconfont icon-r-add"
                  @click="addCheck(scope.row.chId)"
                  > 增加</el-button
                >
              </template>
            </el-table-column>
          </el-table> -->
      <!-- 分页 -->
      <!-- <el-pagination
            @size-change="checkSizeChange"
            @current-change="checkCurrentChange"
            background
            layout="total, prev, pager, next"
            :total="checkTotal"
            :page-size="checkSize"
          >
          </el-pagination>
        </el-col> -->
      <!-- 右边已选择的检查 -->
      <!-- <el-col :span="12" class="drugRigth">
          <el-table stripe border class="rigthTable" :data="checkBuyData">
            <el-table-column label="编号" prop="chId"></el-table-column>
            <el-table-column label="项目" prop="chName"></el-table-column>
            <el-table-column label="价格" prop="chPrice"></el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  style="font-size: 14px;"
                  icon="iconfont icon-r-delete"
                  @click="deleteCheck(scope.row.chId)"
                  > 移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-tag>共计：{{ checkTotalPrice }}元</el-tag>
        </el-col>
      </el-row> -->
    </el-card>

    <!-- 病因编写对话框 -->
    <!-- <el-dialog title="病因编写" :visible.sync="reasonFormVisible">
      <el-input
        type="textarea"
        :rows="8"
        placeholder="请输入内容"
        v-model="reason"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reasonFormVisible = false" style="font-size: 18px;"><i class="iconfont icon-r-left" style="font-size: 20px;"></i> 取 消</el-button>
        <el-button type="primary" @click="holdReason">保存</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      visitorId: "非填",
      visitorName: "非填",
      gender: "非填",
      phone: "非填",
      unitId: "非填",
      doctorId: "非填",
      dName: "非填",
      treatment: {},
      treatments:[],
      size: 4,
      pageNumber: 1,
      total: 3,
      queryDrug: "",
      drugBuyData: [],
      drugTotalPrice: 0,
      //病因
      reason: "",
      //项目表格数据
      checkData: [],
      queryCheck: "",
      checkTotal: 3,
      checkSize: 4,
      checkPageNumber: 1,
      checkTotalPrice: 0,
      checkBuyData: [],
      // 病因编写对话框显示参数
      reasonFormVisible: false,
    };
  },
  methods: {
    // getTreatmentCateGory(){
    //   this.$axios.get("http://localhost/treatment/getTreatmentCateGory").then((res) => {
    //     if (res.data.code == 200) {
    //       this.t = res.data.data;
    //     }
    //   });
    // }
  },
  created() {},
};
</script>

<style>
</style>