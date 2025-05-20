<template>
  <v-container class="d-flex align-center justify-center min-h-screen">
    <v-card class="pa-6" max-width="500" elevation="10" rounded="xl">
      <v-card-title class="text-h5 text-center mb-4">Sign Up</v-card-title>
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleSignUp">
        <v-text-field
          v-model="user.firstName"
          label="First Name"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-account"
          required
        />
        <v-text-field
          v-model="user.lastName"
          label="Last Name"
          class="mt-2"
          :rules="[rules.required]"
          prepend-inner-icon="mdi-account"
          required
        />
        <v-text-field
          v-model="user.email"
          label="Email"
          class="mt-2"
          :rules="[rules.required, rules.email]"
          prepend-inner-icon="mdi-email"
          required
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          class="mt-2"
          :rules="[rules.required, rules.password]"
          prepend-inner-icon="mdi-lock"
          required
        />
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          class="mt-2"
          :rules="[rules.required, rules.confirmPassword]"
          prepend-inner-icon="mdi-lock-check"
          required
        />
        <v-text-field
          v-model="user.phone"
          label="Phone"
          class="mt-2"
          :rules="[rules.phone]"
          prepend-inner-icon="mdi-phone"
          required
        />
        <div class="mt-2">
          <label>Select your favourite color</label>
          <v-menu v-model="colorMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn v-bind="props" :color="user.color" icon class="ml-2">
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>

            <v-color-picker v-model="user.color" width="300" class="ma-2" />
          </v-menu>
        </div>
        <v-btn class="mt-4" color="primary" type="submit" :disabled="!valid" block>Register</v-btn>
        <div class="text-center mt-4">
          <span>Already have an account?</span>
          <v-btn variant="text" color="primary" @click="goToLogin">Sign In</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>

  <v-snackbar v-model="signUpSuccess" :timeout="2000" color="success">
    Register Done!!
    <template #actions>
      <v-btn color="blue" variant="text" @click="signUpSuccess = false">Close</v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="signUpInvalid" :timeout="2000" color="error">
    Error

    <template #actions>
      <v-btn color="blue" variant="text" @click="signUpInvalid = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { signUp } from '@/services/auth'
  import type { User } from '@/types/user'
  import { ref, type Ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const valid = ref(false)
  const formRef = ref()

  const user: Ref<User> = ref({ email: ' ', firstName: ' ', lastName: ' ', phone: ' ', color: ' ' })

  const password = ref('')
  const confirmPassword = ref('')

  const colorMenu = ref(false)

  const signUpSuccess = ref(false)
  const signUpInvalid = ref(false)

  const rules = {
    required: (v: string) => !!v || 'This field is required',
    phone: (v: string) =>
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?([-.\s]?\d{1,4}){1,3}$/.test(v) || 'Invalid phone number',
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email address',
    password: (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters',
    confirmPassword: (v: string) => v === password.value || 'Passwords do not match',
  }

  const handleSignUp = async () => {
    if (!formRef.value?.validate()) return

    console.log('USERR', user.value)

    try {
      await signUp(user.value, password.value)
      signUpSuccess.value = true
      router.push('/')
    } catch (error: any) {
      console.log(error)
    }
  }

  const goToLogin = () => {
    router.push('/')
  }
</script>

<style scoped>
  .min-h-screen {
    min-height: 100vh;
  }
</style>
