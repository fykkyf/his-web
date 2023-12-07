<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true">添加新员工</el-button>
    <el-table
        :data="employeeVOs"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="employeeId"
          label="员工编号"
          width="100">

      </el-table-column>

      <el-table-column
          prop="employeeName"
          label="员工姓名">
        <template slot-scope="scope">
          <el-tag type="info"> {{scope.row.employeeName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          prop="unit.unitName"
          label="科室">
        <template slot-scope="scope">
          <el-tag > {{scope.row.unit.unitName}}</el-tag>
        </template>

      </el-table-column>
      <el-table-column
        prop="role.roleName"
        label="职位">
        <template slot-scope="scope">
          <el-tag type="success" > {{scope.row.role.roleName}}</el-tag>
        </template>
    </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit"  @click="editEmployee(scope.row)">编辑</el-button>
          <el-button  type="danger" icon="el-icon-delete" @click="removeEmployee(scope.row,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加员工信息" :visible.sync="show">
      <el-form :model="employeeVO" >
        <el-form-item label="员工姓名" style="margin-left: 290px; text-align: right;  width: 200px">
          <el-input v-model="employeeVO.employeeName"></el-input>
        </el-form-item>

        <span style="margin-right: 155px">科室</span>
        <br><br>
        <el-form-item title="科室">
        <el-select v-model="employeeVO.unitId"  clearable placeholder="请选择科室" >
          <el-option
              v-for="unit in units"
              :key="unit.unitId"
              :label="unit.unitName"
              :value="unit.unitId"
          ></el-option>

        </el-select>
        </el-form-item>
        <span style="margin-right: 155px">职位</span>
        <br><br>
        <el-form-item title="职位">
        <el-select v-model="employeeVO.roleId"  clearable placeholder="请选择职位">
          <el-option
              v-for="role in roles"
              :key="role.roleId"
              :label="role.roleName"
              :value="role.roleId"
          ></el-option>

        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="toUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>



</template>

<script>
export default {
  data() {
    return {
      employeeVOs:[],
      employeeDTO:{
        employeeId:'',
        employeeName:'',
        roleId:'',
        unitID:'',
      },
      roles:[],
      units:[],
      unit:{
        unitId:'',
        unitName:'',
      },
      role:{
        roleId:'',
        roleName:'',
      },

      employeeVO:{
        employeeId:'',
        employeeName:'',
        role:{},
        unit:{},
      },

      show:false,

    }
  },
  methods: {
    //查询所有医生
    getAllDoctors() {

          this.$axios.get("http://localhost/employee/getAllVO").then(resp => {
            if (resp.data.code == 200) {
              this.employeeVOs = resp.data.data
              console.log(this.employeeVOs);
            } else {
              this.$message(resp.data.data)
            }
          })
    },
    //查询所有科室
    getAllUnits() {
      this.$axios.get("http://localhost/unit/getAll").then(resp => {
        if (resp.data.code == 200) {
          this.units = resp.data.data
        } else {
          this.$message(resp.data.data)
        }
      })
    },
    getAllRoles() {
      this.$axios.get("http://localhost/role/getAll").then(resp => {
        if (resp.data.code == 200) {
          console.log(resp.data.data);
          this.roles = resp.data.data
        } else {
          this.$message(resp.data.data)
        }
      })
    },

    toUpdate(){
      console.log(this.employeeVO);
      this.$axios
          .post("http://localhost/employee/updateEmployee",this.employeeVO)
          .then(res=>{
            if(res.data.code==200){
              this.$message(res.data.msg);
              this.employeeVOs.push(this.employeeVO);
              this.getAllDoctors();
              this.employeeVO = '';
            }else {
              this.$message(res.data.msg);
            }

          })
      this.show=false;
    },
    editEmployee(row){
      console.log(row);
      this.employeeVO = row;
      this.show=true;
    },
    removeEmployee(row, index){

      this.$axios
          .post("http://localhost/employee/removeEmployeeVO/" + row.employeeId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("删除成功")
              this.employeeVOs.splice(index, 1);
            }else {
              this.$message("删除失败")
            }

          })
    },

  },


  created() {
    this.getAllUnits();
    this.getAllDoctors();
    this.getAllRoles();
  },


}
</script>

<style>

</style>