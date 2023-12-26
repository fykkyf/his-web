<template>
  <div>
    <el-button type="success" icon="el-icon-plus" @click="showEdit=true">Create New Role</el-button>
    <el-table :data="roles" style="width: 100%">
      <el-table-column prop="roleId" label="ID" width="100px"> </el-table-column>
      <el-table-column prop="roleName" label="Name" > </el-table-column>
      <el-table-column label="Operations" >
        <template slot-scope="scope">
          <el-button  type="success" @click="giveMenu(scope.$index, scope.row)" >Menu</el-button>
          <el-button  type="primary" @click="editRole(scope.row)" >Edit</el-button>
          <el-button  type="danger" @click="confirmDelete(scope.row,scope.$index)" >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--确认删除对话框    -->

    <!-- 分配菜单的对话框 -->
    <el-dialog
        :title="myTitle"
        :visible.sync="show"
        :model="roleMenu">
      <el-tree
          :data="menus"
          :props="defaultProps"
          show-checkbox
          :expand-on-click-node="false"
          :default-expanded-keys="menucheckedkeys"
          node-key="menuId"
          ref="menutree"
          default-expand-all
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="onSubmit()">Submit</el-button>
      </div>
    </el-dialog>
<!-- edit Role   -->
    <el-dialog title="Create New Position" :visible.sync="showEdit">
      <el-form :model="role">
        <el-form-item label="Job Title" >
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRole">Cancel</el-button>
        <el-button type="primary" @click="toUpdate">Submit</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Confirm" :visible.sync="showConfirm">
      <span>Please Confirm if You Want to Delete</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showConfirm = false">Cancel</el-button>
    <el-button type="primary" @click="deleteRole">Confirm</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      myTitle: "",
      roles: [],
      role:{},
      show: false,
      showEdit: false,
      showConfirm: false,
      deleteIndex:'',
      menus: [],
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      roleMenu: {
        roleId: '',
        menuIds: [],
      },
      roleId:'',
      menucheckedkeys: [],

    };
  },
  created() {
    this.getAllRoles();
  },
  methods: {
    toUpdate(){
      console.log(this.unit);
      this.$axios
          .post("http://localhost/role/updateRole",this.role)
          .then(res=>{
            if(res.data.code==200){
              this.$message(res.data.msg);
              this.getAllRoles();
              this.role = '';
            }else {
              this.$message(res.data.msg);
            }

          })
      this.getAllRoles();
      this.showEdit=false;
    },
    editRole(row){
      console.log(row);
      this.role = row;
      this.showEdit=true;
    },
    confirmDelete(row,index){

      this.role = row;
      this.deleteIndex = index;
      this.showConfirm=true;
    },
    deleteRole(){

      this.$axios
          .post("http://localhost/role/removeRole/" + this.role.roleId)
          .then(res => {
            if (res.data.code == 200) {
              this.$message("Delete Success")
              this.roles.splice(this.deleteIndex, 1);
            }else {
              this.$message("Delete Failed")
            }

          })
      this.showConfirm=false;
    },
    // 获取菜单信息
    getAllMenus() {
      this.$axios.get("http://localhost/menu/getAll").then((resp) => {
        this.menus = resp.data.data;
      });
    },
    // 关闭对话框
    closeDialog() {
      this.show = false;
      this.menucheckedkeys = [];
    },
    closeRole() {
      this.showEdit = false;
      this.role = {};
    },
    // 提交对话框的确定
    onSubmit() {
      let allMenuIds = [];
      // console.log(this.$refs.menutree.getCheckedNodes(false,true));
      //当前tree所有的数据，是个对象集合,先遍历得到对象，在通过对象得到mid
      let all = this.$refs.menutree.getCheckedNodes(false, true);
      for (let a of all) {
        allMenuIds.push(a.menuId);
      }
      this.roleMenu.menuIds = allMenuIds;
      console.log(this.roleMenu.menuIds);
      console.log(this.roleId)
      this.$axios
          .post("http://localhost/role/giveMenu", this.roleMenu)
          .then((resp) => {
            if (resp.data.code == 200) {
              this.$message.success("Set Success");
              this.show = false;
              this.menucheckedkeys = [];
            } else {
              this.$message.error("Failed");
            }
          });
    },
    // 分配菜单
    giveMenu(index, row) {
      this.getAllMenus();
      this.show = true;
      let menuIds = [];
      this.$axios
          .get("http://localhost/role/getMenuIds/" + row.roleId)
          .then((resp) => {
            if (resp.data.code == 200) {
              //所有选中节点中，获取叶子节点
              menuIds = resp.data.data;
              for (let menuId of menuIds) {
                const node = this.$refs.menutree.getNode(menuId);
                if (node && node.isLeaf) {
                  this.menucheckedkeys.push(menuId);
                }
              }
              this.$refs.menutree.setCheckedKeys(this.menucheckedkeys);
              this.roleMenu.roleId = row.roleId;
            }
          });
    },

    // 获取所有角色
    getAllRoles() {
      this.$axios.get("http://localhost/role/getAll").then((resp) => {
        if (resp.data.code == 200) {
          this.roles = resp.data.data;
        }
      });
    },
  },
};
</script>

<style>
.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>