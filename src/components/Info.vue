<script setup="ts">
  import dayjs from "dayjs";
  import { onMounted, ref } from "vue";
  import { fetchBudgetByType } from "@/services/app"
  dayjs.locale('ja');


  const month = dayjs().month()+1
  const budget = ref(0)

  onMounted(async () => {
    const b = await fetchBudgetByType(2);
    budget.value = b.Amount;
  })
</script>

<template>
  <div class="text-right" style="margin-top: 5%;">
    <span v-if="budget >= 0" class="border">
      <span class="jiyu" style="padding-left: 5%;">「{{month}}</span>
      <span class="higure-light">月はあと</span>
      <span class="jiyu" style="color: #D6C494;">¥{{ budget.toLocaleString() }}</span>
      <span class="higure-light">の課金に収めましょう</span>
      <span class="jiyu">」</span>
    </span>
    <span v-else class="border">
      <span class="jiyu" style="padding-left: 5%;">「{{month}}</span>
      <span class="higure-light">月は</span>
      <span class="jiyu" style="color: #D6C494;">¥{{ budget.toLocaleString() }}</span>
      <span class="higure-light">だけ超過しています</span>
      <span class="jiyu">」</span>
    </span>
  </div>
</template>

<style>
.border {
  border-bottom: 0.124rem solid #D6C494;
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