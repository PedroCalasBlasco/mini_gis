<template>
  <router-view />
  <CustomSnackbar
    v-model:snackbar="snackbar.show"
    :type="snackbar.type"
    :message="snackbar.message"
  />
</template>

<script setup lang="ts">
  import CustomSnackbar from '@/components/basics/CustomSnackbar.vue'
  import { useSnackbarStore } from '@/store/snackbar'
  const snackbar = useSnackbarStore()
</script>
