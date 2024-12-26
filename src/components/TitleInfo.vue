<script setup lang="ts">
  import dayjs from "dayjs";
  import { onMounted, ref } from "vue";
  import { fetchBudgetByType } from "@/services/app"
  dayjs.locale('ja');


  const month = dayjs().month()+1
  const budget = ref(0)
  const budgetString = ref("")

  const isBudgetSafe = ref(false)
  const isBudgetDanger = ref(false)
  const isBudgetOut = ref(false)

  const isLoading = ref(true); // ローディング状態を管理

  onMounted(async () => {
    try {
      const b = await fetchBudgetByType(2);
      budget.value = b.amount;
      budgetString.value = budget.value.toLocaleString();

      switch (true) {
        case budget.value >= 10000:
          isBudgetSafe.value = true;
          isBudgetDanger.value = false;
          isBudgetOut.value = false;
          break;
        case budget.value < 10000 && budget.value >= 0:
          isBudgetSafe.value = false;
          isBudgetDanger.value = true;
          isBudgetOut.value = false;
          break;
        case budget.value < 0:
          isBudgetSafe.value = false;
          isBudgetDanger.value = false;
          isBudgetOut.value = true;
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false; // ローディング完了
    }
  })
</script>

<template>
  <div class="text-right " style="margin-top: 10%; margin-bottom: 10%;">
    <div v-if="isLoading">ロード中。。。</div>
    <div v-if="!isLoading">
      <span v-if="isBudgetSafe" class="border">
        <span class="jiyu" style="padding-left: 5%;">「{{month}}</span>
        <span class="higure-light">月はあと</span>
        <span class="jiyu amount" style="color: #D6C494;">¥{{ budgetString }}</span>
        <span class="higure-light">の課金に収めましょう</span>
        <span class="jiyu">」</span>
      </span>
      <span v-if="isBudgetDanger" class="border">
        <span class="jiyu" style="padding-left: 5%;">「{{month}}</span>
        <span class="higure-light">月はあと</span>
        <span class="jiyu amount" style="color: #EF9E9E;">¥{{ budgetString }}</span>
        <span class="higure-light">の課金に収めましょう</span>
        <span class="jiyu">」</span>
      </span>
      <span v-if="isBudgetOut" class="border" >
        <span class="jiyu" style="padding-left: 5%;" >「{{month}}</span>
        <span class="higure-light">月は</span>
        <span class="jiyu amount" style="color: #9EBDEF;" >¥{{ budgetString }}</span>
        <span class="higure-light">設定額を</span>
        <span class="higure-light" style="color: #9EBDEF;" >超過</span>
        <span class="higure-light">しています</span>
        <span class="jiyu">」</span>
      </span>
    </div>
  </div>
</template>

<style>
.border {
  border-bottom: 0.124rem solid #D6C494;
}

.amount {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
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
</style>