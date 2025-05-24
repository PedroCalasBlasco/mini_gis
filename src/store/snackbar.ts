import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref<'success' | 'error' | 'info' | 'warning'>('info')

  function openSnackbar(newMessage: string, newType: typeof type.value = 'info') {
    message.value = newMessage
    type.value = newType
    show.value = true

    setTimeout(() => {
      show.value = false
    }, 3000)
  }

  return { show, message, type, openSnackbar }
})
