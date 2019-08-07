<template>
  <sticky :z-index="10" class="sub-navbar">
    <el-button style="margin-left: 10px;" type="success" @click="onCreateButtonClicked">
      Create
    </el-button>
    <el-button style="margin-left: 10px;" type="success" @click="onSaveButtonClicked">
      Save
    </el-button>
  </sticky>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'Test',
  components: { Sticky },
  data() {
    return {
      msg: 'hello vue'
    }
  },
  methods: {
    onSaveButtonClicked: function() {
      this.$emit('onSaveButtonClicked')
    },
    onCreateButtonClicked: function() {
      this.$emit('onCreateButtonClicked')
    }
  }
}
</script>

<style>
</style>
