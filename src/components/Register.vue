<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import dayjs from "dayjs";
  dayjs.locale('ja');
  import z from "zod"
  import { useQuasar } from "quasar";
  import { getApps, createHistory, checkDuplicateApp, createApp, updateApp } from "@/services/app"
  import { appObject, historyObject, optionObject } from "@/services/zodobject";

  const $q = useQuasar()

  // 初期値
  const date = ref(dayjs().format('YYYY / MM / DD'))
  const model = ref(null)
  const newApps = ref()
  const oldApps = ref()
  const newOptions = ref(new Array)
  const oldOptions = ref(new Array)
  const appExpanded = ref(false)
  const billingAmount = ref(null)
  const isEditing = ref(false)
  const noAppSelected = ref(false)
  const noAmount = ref(false)
  const isDuplicateApp = ref(false)

  const updateAppMap = ref(new Map<number, string>())
  const createdAppArray = ref(new Array)
  const createAppName = ref("")
  const nowOptions = ref()

  // 画面関数
  async function submitForm() {
    // バリデーション
    const isErrApp = errApp();
    const isErrAmount = errAmount();

    if (isErrApp || isErrAmount) {
      return
    }

    const req = {
      AppID: model.value,
      Amount: Number(billingAmount.value),
      PurchaseDate: new Date(date.value),
    }
    const m = historyObject.parse(req)
    await createHistory(m.AppID, m.Amount, m.PurchaseDate)

    // 初期化
    model.value = null
    billingAmount.value = null
    date.value = dayjs().format('YYYY / MM / DD')

    // 通知
    $q.notify({
      type: 'positive',
      position: 'top',
      message: '登録しました',
    })
  }
  function changeApps() {
    noAppSelected.value = false
  }
  function changeAmount() {
    noAmount.value = Number(billingAmount.value) < 1 || Number(billingAmount.value) > 100000
  }
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
      
      newOptions.value.map((opt) => {
        if (opt.value === k) {
          opt.label = v
        }
      })
      
      oldOptions.value.map((opt) => {
        if (opt.value === k) {
          opt.label = v
        }
      })
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

    createdAppArray.value.push(appObject.parse(cApp));

    nowOptions.value = createdAppArray.value.map(app =>{
      const a = { "value": app.id, "label" : app.name }
      return optionObject.parse(a)
    });

    createAppName.value = "";
    isDuplicateApp.value = false;
    isEditing.value = false;
  }

  // バリデーション
  const errAmount = (() => {
    if (Number(billingAmount.value) < 1) {
      noAmount.value = true
      return true
    }
  })
  const errApp = (() => {
    if (model.value === null) {
      noAppSelected.value = true
      return true
    }
  })

  // マウントされた時
  onMounted(async () => {
    const pd = await getApps();

    const apps = z.array(
      appObject
    ).parse(pd);

    const newA = apps.filter(function(_, index) {
        return index < 5
    });
    newApps.value = newA;
    newOptions.value = newA.map(app =>{
      const a = { "value": app.id, "label" : app.name }
      return optionObject.parse(a)
    });

    const oldA = apps.filter(function(_, index) {
        return index >= 5
    });
    oldApps.value = oldA;
    oldOptions.value = oldA.map(app =>{
      const a = { "value": app.id, "label" : app.name }
      return optionObject.parse(a)
    })
  });

  watch(createAppName, () => {
    if (createAppName.value === "") {
      isDuplicateApp.value = false;
    };
  });

</script>

<template>
  <q-page>
    <div class="q-pa-none form">
      <div class="q-gutter-md">

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">01</span>
            <span class="title-name title-content">課金対象</span>
          </div>
        </div>
        <hr color="#D6C494" size="0" style="margin: 0%;">

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

        <q-option-group
          :options="newOptions"
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
          <div style="text-align: center;">その他を表示</div>
          <label class="switch">
            <input type="checkbox" v-model="appExpanded">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="toggle row justify-end q-gutter-x-md">
          <div style="text-align: center;">編集</div>
          <label class="switch">
            <input type="checkbox" v-model="isEditing">
            <span class="slider round"></span>
          </label>
        </div>

        <div class="input-field">
          <q-option-group
          :options="oldOptions"
          :class="{ 'none-vision': !appExpanded }"
          type="radio"
          v-if="!isEditing"
          v-model="model"
          color="positive"
          keep-color
          size="xs"
          class="input-bg-color"
          style="margin-left: 0%;"
          v-on:update:model-value="changeApps()"
          />
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


        <p v-if="noAppSelected" class="error input-field text-right">課金対象を選択してください</p>

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">02</span>
            <span class="title-name title-content">課金額</span>
          </div>
        </div>
        <hr color="#D6C494" size="0" style="margin: 0%;">

        <q-input 
          v-model="billingAmount"
          type="text"
          borderless
          color="positive"
          bg-color="warning"
          mask="#,###,###"
          reverse-fill-mask
          unmasked-value
          dense
          class="inter input-field"
          input-class="text-right input-bg-color number-input"
          input-style="padding: 5%;"
          v-on:update:model-value="changeAmount()"
        >
          <template v-slot:prepend>
            <q-icon size="1.5rem" class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#D6C494"><g><rect fill="none" height="24" width="24"/></g><g><polygon points="13.92,11 18,11 18,13 13,13 13,15 18,15 18,17 13,17 13,21 11,21 11,17 6,17 6,15 11,15 11,13 6,13 6,11 10.08,11 5,3 7.37,3 12,10.29 16.63,3 19,3"/></g></svg>
            </q-icon>
          </template>
        </q-input>
        <p v-if="noAmount" class="error input-field text-right">1円以上の金額を入力してください</p>

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">03</span>
            <span class="title-name title-content">日付</span>
          </div>
        </div>
        <hr color="#D6C494" size="0" style="margin: 0%;">

        <q-input 
          v-model="date" 
          borderless
          dense
          color="positive"
          bg-color="warning"
          mask="#### / ## / ##"
          class="inter input-field" 
          input-class="text-right input-bg-color"
          input-style="padding: 5%;"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="img:/src/assets/img/calendar.png" class="cursor-pointer icon">
            </q-icon>
          </template>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" color="positive" mask="YYYY / MM / DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="positive" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-input>

        <div class="row justify-end">
          <q-btn class="higure-regular reg-button" outline label="登録" @click="submitForm()" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  .form {
    max-width: 20rem;
  }

  .bg-input {
    background: #FAF7F1;
  }

  .jiyu {
  font-family: 'JiyunoTsubasa';
  }
  .higure-light {
    font-family: 'Higure-light';
  }
  .higure-regular {
    font-family: 'Higure-regular';
  }
  .inter {
    font-family: 'inter';
  }

  .title {
    margin-left: 10%;
    position: relative;
    top: 0.8rem;
  }

  .title-number {
    color: #D6C494;
    font-size: x-large;
  }

  .title-name {
    vertical-align: middle;
  }

  .title-content {
    padding-left: 2%;
    letter-spacing: 0.2rem;
  }

  .input-field {
    margin-left: 20%;
  }

  .input-bg-color {
    background-color: #FAF7F1;
  }

  .none-vision {
    display: none !important;
  }

  .reg-button {
    color: #D6C494;
  }

  .icon {
    padding: 35%;
  }

  .app-input {
    /* 入力欄の高さを変更 */
    height: 1.075rem;
    border-bottom: 0.1rem solid #D6C494 !important;

    margin: 0.4rem 0;
    margin-left: 2.4rem;
  	padding: 0;
  	background: none;
  	border: none;
  	border-radius: 0;
  	outline: none;
  	-webkit-appearance: none;
  	-moz-appearance: none;
  	appearance: none;
  }

  .in-button {
    font-size: xx-small; 
    float: right;
    background-color: transparent;
    border: 0.1rem solid #D6C494;
    border-radius: 5px;
    cursor: pointer;
    padding: 0.1rem 0.3rem;
    margin: 0.23rem;
    vertical-align: middle;
  }


  /* トグル */
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  } 

  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  } 

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E6E6E1;
    -webkit-transition: .4s;
    transition: .4s;
  } 

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  } 

  input:checked + .slider {
    background-color: #D6C494;
  } 

  input:focus + .slider {
    box-shadow: 0 0 1px #D6C494;
  } 

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  } 

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  } 

  .slider.round:before {
    border-radius: 50%;
  } 

  </style>
