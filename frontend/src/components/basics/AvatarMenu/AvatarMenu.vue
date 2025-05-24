<template>
  <v-avatar id="menu-activator" :color="user.color ? user.color : '#ffffff'">
    <v-icon>mdi-account</v-icon>
  </v-avatar>

  <v-menu activator="#menu-activator">
    <v-card>
      <v-card-title>
        <p>Welcome</p>
      </v-card-title>
      <v-card-subtitle>
        <label>{{ user.firstName + ' ' + user.lastName }}</label>
      </v-card-subtitle>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <v-list-item-title @click="item.action">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>

  <UserInformationDialog
    v-model:user="user"
    v-model:dialog="dialog"
    :user-initial-data="userInitialData"
  />
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { getUserById } from '@/services/users'
  import type { User } from '@/types/user'
  import { useStorage } from '@vueuse/core'
  import { onMounted, ref } from 'vue'

  import UserInformationDialog from './UserInformationDialog.vue'
  import { cloneDeep } from 'lodash'

  const dialog = ref(false)

  const items = [
    { title: 'View Details', action: openUserDetails },
    { title: 'Logout', action: logout },
  ]

  const user = ref<User>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    color: '',
  })

  let userInitialData: User = { firstName: '', lastName: '', email: '', phone: '', color: '' }

  function openUserDetails() {
    dialog.value = true
  }

  function logout() {
    const token = useStorage('token', '')
    const userId = useStorage('userId', '')
    const expiresAt = useStorage('expiresAt', '0')

    token.value = ''
    userId.value = ''
    expiresAt.value = ''

    router.push('/')
  }

  onMounted(async () => {
    const token = useStorage('token', '')
    const userId = useStorage('userId', '')
    const expiresAt = useStorage('expiresAt', '0')

    // Validar expiración
    if (Date.now() > Number(expiresAt.value)) {
      console.warn('Sesión expirada')

      token.value = ''
      userId.value = ''
      expiresAt.value = ''
      return
    }

    try {
      const fetchedUser = await getUserById(userId.value, token.value)
      userInitialData = cloneDeep(fetchedUser)
      user.value = cloneDeep(userInitialData)
      console.log('Usuario:', userInitialData)
    } catch (error) {
      console.error('Error', error)
    }
  })
</script>
