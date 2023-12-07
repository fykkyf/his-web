<template>
  <div>
    <el-table :data="roles" style="width: 100%">
      <el-table-column prop="roleId" label="序号" width="100"> </el-table-column>
      <el-table-column prop="roleName" label="姓名" width="100"> </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button  type="primary" @click="giveMenu(scope.$index, scope.row)" width="100">
            分配菜单
          </el-button>

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
        <el-button type="primary" @click="onSubmit()">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
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
      show: false,
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
              this.$message.success("分配成功~");
              this.show = false;
              this.menucheckedkeys = [];
            } else {
              this.$message.error("分配失败");
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