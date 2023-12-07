<template>
  <div class="background">
    <el-form ref="form" :model="user" label-width="80px" class="loginForm">
      <div class="container">
        <el-form-item label="账号">
          <el-input v-model="user.userName"></el-input>
        </el-form-item>
      </div>
      <div class="container">
        <el-form-item label="密码">
          <el-input v-model="user.password" show-password></el-input>
        </el-form-item>
      </div>

      <el-form-item label="验证码">
        <el-input v-model="user.verifycode"></el-input>
        <img :src="verifycodesrc" @click="createVerifyCode()" />
      </el-form-item>

      <div class="container">
        <el-form-item>
          <el-button @click="login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="findpassword">找回密码</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        verifycode: "",
        uuid: "",
      },
      //   verifycode: "",
      verifycodesrc: "",
      //   uuid: "",
    }
  },
  created() {
    this.createVerifyCode();
  },
  methods: {
    findpassword() {
      this.$router.push("/find")
      // window.location.href="http://localhost:8081/find"
    },
    createVerifyCode() {
      // this.verifycodesrc="http://localhost:8080/verifycode?t"+new Date();
      this.$axios.get("http://localhost/verifycode").then((resp) => {
        if (resp.data.code == 200) {
          this.verifycodesrc =
            "data:image/png;base64," + resp.data.data.verifycodesrc;
          this.user.uuid = resp.data.data.uuid;
        }
      });
    },
    jumpMain() {
      this.$router.push("/MainMenu");
    },
    login() {
      this.$axios
        .post("http://localhost/user/login",this.user
        //   verifycode: this.verifycode,
        //   uuid: this.uuid,
        )
        .then((res) => {
          if (res.data.code == 200) {
            // localStorage.setItem("token",res.headers.token)
            this.jumpMain();
          } else if (res.data.code == 500) {
            this.$message({
              message: res.data.data,
              type: "error",
            })
            this.createVerifyCode();
          } else {
            this.$message({
              message: res.data.data,
              type: "error",
            })
            this.createVerifyCode();
          }
        });
    },
  },
};
</script>

<style scoped>
.loginForm {
  width: 500px;
  margin: 0px auto;
  padding-top: 100px;
}
.background {
  background-image: url("/src/assets/images/login.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
}

</style>