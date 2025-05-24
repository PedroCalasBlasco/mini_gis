<template>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title>User Information</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="user.firstName"
                label="Firstname"
                :rules="[rules.required]"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="user.lastName"
                label="Lastname"
                :rules="[rules.required]"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="user.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="user.phone" label="Phome" required />
            </v-col>
            <v-col cols="6">
              <label>Select your favourite color</label>
              <v-menu v-model="colorMenu" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn v-bind="props" :color="user.color" icon class="ml-2">
                    <v-icon>mdi-palette</v-icon>
                  </v-btn>
                </template>

                <v-color-picker v-model="user.color" width="300" class="ma-2" />
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="submitForm">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { editUser } from '@/services/users'
  import type { User } from '@/types/user'
  import { useStorage, useVModel } from '@vueuse/core'
  import { cloneDeep } from 'lodash'
  import { ref } from 'vue'

  const props = defineProps<{
    user: User
    dialog: boolean
    userInitialData: User
  }>()

  const emit = defineEmits<{
    (e: 'update:user', value: User): void
    (e: 'update:dialog', value: boolean): void
  }>()

  const user = useVModel(props, 'user', emit)
  const dialog = useVModel(props, 'dialog', emit)

  const token = useStorage('token', '')
  const userId = useStorage('userId', '')

  const colorMenu = ref(false)

  const valid = ref(false)
  const formRef = ref()

  const rules = {
    required: (v: string) => !!v || 'Campo obligatorio',
    email: (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido',
  }

  const submitForm = async () => {
    if (!formRef.value?.validate()) return
    console.log('Datos del usuario:', user.value)
    dialog.value = false
    await editUser(userId.value, token.value, user.value)
  }

  function cancel() {
    dialog.value = false
    console.log('PPPPPPPP', props.userInitialData)
    user.value = cloneDeep(props.userInitialData)
  }
</script>
