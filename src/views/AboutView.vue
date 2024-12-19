<script setup="ts">
import BarChart from '@/components/BarChart.vue';
import { onMounted, ref } from 'vue';
import { fetchAppHistory } from '@/services/app';
import z from 'zod'
import { appHistoryObject } from '@/services/zodobject';

const labels = ref(null)
const data = ref(null)

onMounted(async () => {
  const appHistory = await fetchAppHistory();

  const histories = z.array(appHistoryObject).parse(appHistory)

  labels.value = histories.map(h => {
    return h.name;
  });
  data.value = histories.map(h => {
    return h.amount;
  });

})

</script>

<template>
  <div class="about">
    <BarChart v-if="labels && data" title="今月の課金ランキング" :labels="labels" :data="data" />
  </div>
</template>

<style scoped>
</style>
