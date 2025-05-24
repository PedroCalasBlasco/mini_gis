<template>
  <v-container class="d-flex align-center justify-center min-h-screen">
    <v-card class="pa-6" max-width="400" elevation="10" rounded="xl">
      <v-card-title class="text-h5 text-center mb-4">Sign In</v-card-title>
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
          prepend-inner-icon="mdi-email"
          type="email"
          required
        />
        <v-text-field
          v-model="password"
          label="Password"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-lock"
          type="password"
          class="mt-2"
          required
        />
        <v-btn class="mt-4" color="primary" type="submit" :disabled="!valid" block>Login</v-btn>
      </v-form>
      <div class="text-center mt-4">
        <span>Don't have an account?</span>
        <v-btn variant="text" color="primary" @click="goToSignUp">Sign Up</v-btn>
      </div>
    </v-card>
  </v-container>

  <v-snackbar v-model="invalidLogin" :timeout="2000">
    Invalid Login

    <template #actions>
      <v-btn color="blue" variant="text" @click="invalidLogin = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import router from '@/router'
  import { login } from '@/services/auth'
  import { ref } from 'vue'
  import { useStorage } from '@vueuse/core'

  const email = ref('')
  const password = ref('')
  const valid = ref(false)
  const formRef = ref()
  const invalidLogin = ref(false)

  const rules = {
    required: (value: string) => !!value || 'Este campo es obligatorio',
    email: (value: string) => /.+@.+\..+/.test(value) || 'Introduce un correo válido',
  }

  const handleLogin = async () => {
    if (!formRef.value?.validate()) return
    try {
      const response = await login({ email: email.value, password: password.value })

      console.log('MYRESPONSE', response)

      const token = useStorage('token', '')
      token.value = response.token

      const userId = useStorage('userId', response.id)
      userId.value = response.id

      // Guardar expiración (ahora + 10 minutos)
      const expiresAt = useStorage('expiresAt', '')
      expiresAt.value = (Date.now() + 10 * 60 * 1000).toString()

      router.push({ name: 'dashboard', params: { userId: userId.value } })
    } catch (error) {
      console.error('Error en login:', error)
      invalidLogin.value = true
    }
  }

  const goToSignUp = () => {
    router.push('/signup')
  }
</script>

<style scoped>
  .min-h-screen {
    min-height: 100vh;
  }
</style>
