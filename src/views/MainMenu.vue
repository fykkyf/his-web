<template>
  <div>
    <el-container>
      <el-header>
        <!-- <el-form-item>
          <el-button @click="exit">退出登录</el-button>
        </el-form-item> -->
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :router="true" style=" text-align: left;">
            <el-submenu v-for="menu in menus" :key="menu.menuId" :index="menu.menuId + ''">
              <template slot="title"><i class="el-icon-message"></i>{{ menu.menuName }}</template>
              <el-menu-item-group>
                <el-menu-item v-for="submenu in menu.children" :key="submenu.menuId"
                  :index="submenu.path">{{ submenu.menuName }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
    };
  },
  methods: {
    getMenus() {
      this.$axios.get("http://localhost/menu/getAll").then((resp) => {
        this.menus = resp.data.data;
      });
    },
    exit() {
      localStorage.removeItem("token");
      this.jump();
    },
    jump() {
      this.$router.push("/login");
    },
    // checkLogin() {
    //   // 检查用户登录状态的逻辑
    //   // 可以是检查本地存储、cookie等方式
    //   let token = localStorage.getItem("token");
    //   if (token) {
    //     // 用户已登录
    //     return true;
    //   } else {
    //     // 用户未登录
    //     return false;
    //   }
    // },
  },
  created() {
    this.getMenus();
    // if (!this.checkLogin()) {
    //   // 用户未登录，跳转到登录页面
    //   this.jump();
    // } else {
    //   // 用户已登录，执行其他操作
    // }
  },
};
</script>

<style>
.el-container {
  height: 100vh;
}

.el-header {
  background-color: #35495e; /* 更改顶部栏颜色 */
  color: white;
  text-align: right;
  padding: 10px;
}

.el-aside {
  background-color: #75899c; /* 更改侧边栏颜色 */
  color: white;
}

.el-menu {
  background-color: #75899c; /* 更改菜单背景颜色 */
}

.el-menu-item, .el-submenu {
  color: white; /* 更改菜单项文本颜色 */
}

.el-main {
  background-image: linear-gradient(to bottom, #87cefa, #fff); /*更改主内容区背景颜色*/
  padding: 20px;
}
</style>