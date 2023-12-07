<template>
    <div>
      <h1>添加病人信息</h1>
      <el-form :model="patientForm" label-position="top" @submit.native.prevent="addPatient">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="patientForm.name" required></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="patientForm.age" type="number" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">添加病人信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        patientForm: {
          name: '',
          age: null,
        }
      };
    },
    methods: {
      addPatient() {
        // 在这里执行添加病人信息的逻辑，可以将数据发送到后端API
        // 例如
      }
    }
  };
  </script>