<script lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from "quasar";
import { checkDuplicateApp, createApp, updateApp } from "@/services/app"
import { appObject, optionObject } from "@/services/zodobject";

const $q = useQuasar()

const isEditing = ref(false)
const isDuplicateApp = ref(false)
const updateAppMap = ref(new Map<number, string>())
const createdAppArray = ref([])
const createAppName = ref("")
const nowOptions = ref()
const newApps = ref()
const oldApps = ref()
const newOptions = ref([])
const oldOptions = ref([])



function changeAppName(id: number, name: string) {
    updateAppMap.value.set(id, name)
  }
  async function updateAppName() {

    const argArray = new Array<object>()

    updateAppMap.value.forEach((v, k) =>{
      argArray.push({
        id: k,
        name: v,
      })
      
    //   newOptions.value.map((opt) => {
    //     if (opt.value === k) {
    //       opt.label = v
    //     }
    //   })
      
    //   oldOptions.value.map((opt) => {
    //     if (opt.value === k) {
    //       opt.label = v
    //     }
    //   })
    })

    await updateApp(argArray);

    isEditing.value = false

    // 通知
    $q.notify({
      type: 'positive',
      position: 'top',
      message: '更新しました',
    })
  }

  async function addCreateAppName(name: string) {
    if (name === "") {
      return
    };
    const check = await checkDuplicateApp(name);
    if (check.is_duplicate) {
      isDuplicateApp.value = true
      return
    };

    // 登録
    const cApp = await createApp(name);

    // createdAppArray.value.push(appObject.parse(cApp));

    // nowOptions.value = createdAppArray.value.map(app =>{
    //   const a = { "value": app.id, "label" : app.name }
    //   return optionObject.parse(a)
    // });

    createAppName.value = "";
    isDuplicateApp.value = false;
    isEditing.value = false;
  }

  watch(createAppName, () => {
    if (createAppName.value === "") {
      isDuplicateApp.value = false;
    };
  });

</script>

<template>
    <div class="input-field input-bg-color" v-if="isEditing">
    <input 
      class="app-input"
      v-model="createAppName"
    >
    <button class="higure-regular reg-button in-button" @click="addCreateAppName(createAppName)" >
      登録
    </button>
    </div>
    <p v-if="isDuplicateApp && isEditing" class="error input-field text-right">既に登録されている課金対象です</p>

    <div class="input-field input-bg-color" v-if="isEditing">
      <button class="higure-regular reg-button in-button" @click="updateAppName()" >
        更新
      </button>
      <div 
        v-for="app in newApps"
        :key="app.id"
      >
        <input 
          class="app-input"
          v-model="app.name" 
          v-on:update:model-value="changeAppName(app.id, app.name)"
        >
      </div>
    </div>
    <q-option-group
      :options="nowOptions"
      keep-color
      color="positive"
      type="radio"
      v-model="model"
      size="xs"
      v-if="!isEditing"
      class="input-field input-bg-color"
      v-on:update:model-value="changeApps()"
    />
    <div class="input-field input-bg-color" v-if="isEditing">
      <div 
        v-for="app in createdAppArray"
        :key="app.id"
      >
        <input 
          class="app-input"
          v-model="app.name"
          v-on:update:model-value="changeAppName(app.id, app.name)"
        >
      </div>
    </div>

    <div class="toggle row justify-end q-gutter-x-md">
          <div style="text-align: center;">編集</div>
          <label class="switch">
            <input type="checkbox" v-model="isEditing">
            <span class="slider round"></span>
          </label>
        </div>
    
        <div class="input-field input-bg-color" v-if="isEditing" :class="{ 'none-vision': !appExpanded }">
          <div 
            v-for="app in oldApps"
            :key="app.id"
          >
            <input 
              class="app-input"
              v-model="app.name" 
              v-on:update:model-value="changeAppName(app.id, app.name)"
            >
          </div>
        </div>


</template>

<style>

</style>