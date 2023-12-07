<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="show=true">添加新床位</el-button>
    <el-table
        :data="locations"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="locationId"
          label="床位编号"
          width="100">
      </el-table-column>

      <el-table-column
          prop="locationName"
          label="床位位置">
      </el-table-column>
      <el-table-column prop="locationStatus" label="床位状态"
                       :filters="[{ text: '未使用', value: '1' }, { text: '使用中', value: '2' }]" :filter-method="filterTag"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.locationStatus === 1 ? 'success' : 'danger'" disable-transitions>{{
              scope.row.locationStatus === 2 ? '使用中' : '未使用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          >
        <template slot-scope="scope">
          <el-button  type="primary" icon="el-icon-edit"  @click="editLocation(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete"  @click="removeLocation(scope.row,scope.$index)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加床位信息" :visible.sync="show">
      <el-form :model="location">
        <el-form-item label="床位位置" >
          <el-input v-model="location.locationName"></el-input>
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
      locations:[],
      location:{
        locationId:'',
        locationName:'',
        locationStatus:'',
      },
      show:false,

    }
  },
  methods: {

    getAllLocations(){
      this.$axios.get("http://localhost/location/get/all")
          .then(resp => {
        if (resp.data.code == 200) {

          this.locations = resp.data.data

        } else {
          this.$message(resp.data.data)
        }
      })
    },
    toUpdate(){
      console.log(this.location);
      this.$axios
          .post("http://localhost/location/updateLocation",this.location)
          .then(res=>{
            if(res.data.code==200 ) {
              if (this.location.locationId == null) {
                this.$message("添加成功");
              } else {
                this.$message("修改成功");
                this.location='';
              }
            }else {
              this.$message(res.data.data);
            }

      })
      this.show=false;
      },
    editLocation(row){
      console.log(row);
      this.location = row;
      this.show=true;
    },
    removeLocation(row,index){

      this.$axios
          .post("http://localhost/location/removeLocation/" + row.locationId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("删除成功")
              this.locations.splice(index, 1);
            }else {
              this.$message("删除失败")
            }

          })
    },

  },


  created() {
    this.getAllLocations();

  },


}
</script>

<style>

</style>