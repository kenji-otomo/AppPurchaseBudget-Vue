<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import dayjs from "dayjs";
  dayjs.locale('ja');
  import axios from "axios";
  import z from "zod"

  // 初期値
  const date = ref(dayjs().format('YYYY / MM / DD'))
  const model = ref(null)
  const newOptions = ref()
  const oldOptions = ref()
  const appExpanded = ref(false)
  const billingAmount = ref(null)
  const showApps = ref(true)
  const noAppSelected = ref(false)

  const notToggle = false

  // 別定義
  const url = 'http://localhost:8000/'
  const appObject = z.object({
      ID: z.number(),
      Name: z.string(),
      LastPurchaseAt: z.string(),
      CreatedAt: z.string(),
      UpdatedAt: z.string(),
    });
  const historyObject = z.object({
    AppID: z.number(),
    Amount: z.number().int().min(1, "課金額は1以上の整数で入力してください"),
    PurchaseDate: z.date(),
  });

  // 関数
  async function getApps() {
    try {
      const response = await axios.get(url + 'app'); // await を使う
      return response.data;  // データを返す
    } catch (error) {
      console.error(error);
      return null;  // エラーが発生した場合、nullを返す
    }
  }

  async function createApp() {
    const req = {
      AppID: model.value,
      Amount: Number(billingAmount.value),
      PurchaseDate: new Date(date.value),
    }

    try {
      const m = historyObject.parse(req)
      await axios.post(url + 'history', {
        app_id: m.AppID,
        amount: m.Amount,
        purchase_date: m.PurchaseDate
      })
      .then(response => {
        console.log(response);
        
      }).catch(error => {
        console.error(error);
      })
    } catch (error) {
      console.error(error);
    }

  }

  async function submitForm() {
    await createApp();
  }

  function changeApps() {
    showApps.value = !showApps.value
  }

  onMounted(async () => {
    const pd = await getApps();

    const apps = z.array(
      appObject
    ).parse(pd);

    newOptions.value = apps.filter(function(_, index) {
        return index < 5
    }).map(app =>{
      return {
          "value": app.ID,
          "label" : app.Name,
        }
    })

    oldOptions.value = apps.filter(function(_, index) {
        return index >= 5
    }).map(app =>{
      return {
          "value": app.ID,
          "label" : app.Name,
        }
    })
  })

</script>

<template>
  <q-page>
    <div class="q-pa-md form no-padding">
      <div class="q-gutter-md">

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">01</span>
            <span class="title-name title-content">課金対象</span>
          </div>
        </div>
        <hr color="#DDBA72" size="0" style="margin: 0%;">

        <q-option-group
          :options="newOptions"
          keep-color
          color="positive"
          type="radio"
          v-model="model"
          size="xs"
          class="input-field input-bg-color"
        />

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
          />
        </div>

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">02</span>
            <span class="title-name title-content">課金額</span>
          </div>
        </div>
        <hr color="#DDBA72" size="0" style="margin: 0%;">

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
        >
          <template v-slot:prepend>
            <q-icon size="1.5rem" style="padding: 35%;">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#dDBA72"><g><rect fill="none" height="24" width="24"/></g><g><polygon points="13.92,11 18,11 18,13 13,13 13,15 18,15 18,17 13,17 13,21 11,21 11,17 6,17 6,15 11,15 11,13 6,13 6,11 10.08,11 5,3 7.37,3 12,10.29 16.63,3 19,3"/></g></svg>
            </q-icon>
          </template>
        </q-input>

        <div class="title">
          <div>
            <span class="jiyu title-name title-number">03</span>
            <span class="title-name title-content">日付</span>
          </div>
        </div>
        <hr color="#DDBA72" size="0" style="margin: 0%;">

        <q-input 
          v-model="date" 
          filled
          borderless
          dense
          color="positive"
          bg-color="warning"
          mask="#### / ## / ##"
          class="inter input-field" 
          input-class="text-right input-bg-color"
        >
          <template v-slot:prepend>
            <q-icon name="img:/src/assets/img/calendar.png" class="cursor-pointer">
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
    max-width: 300px;
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
    top: 0.65rem;
  }

  .title-number {
    color: #DDBA72;
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
    color: #DDBA72;
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
    background-color: #DFDED7;
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
    background-color: #DDBA72;
  } 

  input:focus + .slider {
    box-shadow: 0 0 1px #DDBA72;
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
