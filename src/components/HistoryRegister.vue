<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import dayjs from "dayjs";
  dayjs.locale('ja');
  import z from "zod"
  import { useQuasar } from "quasar";
  import { getApps, createHistory } from "@/services/app"
  import { appObject, historyObject, optionObject } from "@/services/zodobject";

  const $q = useQuasar()

  // 初期値
  const date = ref(dayjs().format('YYYY / MM / DD'))
  const model = ref(null)
  const newApps = ref(new Array)
  const oldApps = ref(new Array)
  const newOptions = ref(new Array)
  const oldOptions = ref(new Array)
  const appExpanded = ref(false)
  const billingAmount = ref(null)
  const noAppSelected = ref(false)
  const isAmountValid = ref(false)
  const isHovered = ref(false)
  const noAmount = ref(true)

  const isLoading = ref(true); // ローディング状態を管理
  
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
    isAmountValid.value = Number(billingAmount.value) < 1 || Number(billingAmount.value) > 100000

    if (billingAmount.value === null || billingAmount.value === "") {
      noAmount.value = true;
    } else {
      noAmount.value = false;
    }

    console.log(billingAmount);
    console.log(noAmount);
    
    
  }

  // バリデーション
  const errAmount = (() => {
    if (Number(billingAmount.value) < 1) {
      isAmountValid.value = true
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
    try {
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
      
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false; // ローディング完了
    }
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

        <div v-if="isLoading" class="input-field input-bg-color"></div>
        <div class="input-field sub-title smart-ui">▶︎課金額 TOP5 (過去2ヶ月以内)</div>
        <q-option-group
          v-if="!isLoading && newOptions"
          :options="newOptions"
          keep-color
          color="positive"
          type="radio"
          v-model="model"
          size="xs"
          class="input-field input-bg-color"
          style="margin-top: 0%;"
          v-on:update:model-value="changeApps()"
        />

        <div class="toggle row justify-end q-gutter-x-md">
          <div style="text-align: center;">その他を表示</div>
          <label class="switch">
            <input type="checkbox" v-model="appExpanded">
            <span class="slider round"></span>
          </label>
        </div>

        <div class="input-field">
          <q-option-group
          :options="oldOptions"
          :class="{ 'none-vision': !appExpanded }"
          type="radio"
          v-model="model"
          color="positive"
          keep-color
          size="xs"
          class="input-bg-color"
          style="margin-left: 0%;"
          v-on:update:model-value="changeApps()"
          />
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
          class="roboto-mono input-field"
          :input-class="{ 'number-input': noAmount, 'text-right': true, 'input-bg-color': true }"
          :input-style="{ padding : '5%', color: noAmount ? '#D6C494' : '#67625C' }"
          placeholder="0"
          v-on:update:model-value="changeAmount()"
        >
          <template v-slot:prepend>
            <q-icon size="1.5rem" class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#D6C494"><g><rect fill="none" height="24" width="24"/></g><g><polygon points="13.92,11 18,11 18,13 13,13 13,15 18,15 18,17 13,17 13,21 11,21 11,17 6,17 6,15 11,15 11,13 6,13 6,11 10.08,11 5,3 7.37,3 12,10.29 16.63,3 19,3"/></g></svg>
            </q-icon>
          </template>
        </q-input>
        <p v-if="isAmountValid" class="error input-field text-right">1円以上の金額を入力してください</p>

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
          class="roboto-mono input-field" 
          input-class="text-right input-bg-color"
          input-style="padding: 5%;"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="img:/src/assets/img/calendar.png" class="cursor-pointer icon">
            </q-icon>
          </template>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" color="secondary" mask="YYYY / MM / DD" >
              <div class="row items-center justify-end">
                <q-btn 
                  v-close-popup 
                  label="閉じる" 
                  outline 
                  class="higure-regular reg-button" 
                  :class="{ 'hover-state': isHovered }"
                  @mouseover="isHovered = true"
                  @mouseleave="isHovered = false"
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-input>

        <div class="row justify-end">
          <button 
            :class="{ 'hover-state': isHovered }"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false" 
            class="higure-regular reg-button out-button" 
            @click="submitForm()" 
          >
            登録
          </button>
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
  .smart-ui {
    font-family: 'smart-ui';
  }
  .roboto-mono {
    font-family: 'RobotoMono';
  }

  .noto {
    font-family: 'NotoSansJP-ExtraLight';
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

  .sub-title {
    color: #D6C494;
  }

  .input-field {
    margin-left: 20%;
  }

  .input-bg-color {
    background-color: #FAF7F1;
  }

  .number-input {
    color: #D6C494 !important;
  }

  .none-vision {
    display: none !important;
  }

  .reg-button {
    color: #D6C494;
  }

  .reg-button.hover-state {
    background-color: #D6C494 !important;
    color: white !important;
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

  .out-button {
    border: 0.1rem solid #D6C494;
    border-radius: 5px;
    cursor: pointer;
    padding: 0.1rem 1.5rem;
    vertical-align: middle;
    font-size: large;
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
