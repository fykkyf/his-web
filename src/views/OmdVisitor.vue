<template>
  <div>
    <h1>1111</h1>
  </div>
</template>

<script>
export default {
data() {
        return {
            TreatmentDTO:{},
        }
    },
    created() {
        this.selectAllTreatment2();
    },
    methods: {
      //库存警告
      selectAllTreatment2() {
            this.$axios.post("http://localhost/treatment/selectAllTreatment2",this.TreatmentDTO).then(resp => {
                if (resp.data.code == 200) {
                   this.$message.warning(resp.data.data)
                } else {
                    
                }
            })
        },
    }
}
</script>

<style>

</style>