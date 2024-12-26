<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchHistory } from '@/services/app';
import { purchaseHistoryObject } from '@/services/zodobject';
import { z } from 'zod';
import dayjs from 'dayjs';
dayjs.locale('ja');

const histories = ref();
const isLoading = ref(true);

// インデックスシグネチャを追加
type GroupedByDate = {
    [key: string]: object[]; // string型のキーでItem型の配列を持つ
};

onMounted(async () => {
    try {
        const pd = await fetchHistory();
        const purchaseHistories = z.array(purchaseHistoryObject).parse(pd);

        const groupedByDate: GroupedByDate = purchaseHistories.reduce((acc, item) => {
          const date = item.purchase_date;
          if (!acc[date]) {
            acc[date] = []; // 日付がまだ存在しなければ配列を初期化
          }
          acc[date].push(item); // その日付のグループにアイテムを追加
          return acc;
        }, {} as GroupedByDate);

        histories.value = groupedByDate
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
})
</script>

<template>
    <q-page>
        <div class="q-pa-none container">
            <div class="q-gutter-md">
                <div v-for="(items, date) in histories" :key="date" style="margin-bottom: 2%;">
                    <div class="border" style="margin-bottom: 3%;">{{ dayjs(new Date(date)).format('YYYY/MM/DD(ddd)') }}</div>
                    <div style="background-color: #F8F6F0; padding: 4%;">
                        <div v-for="item in items" :key="item.id">
                            <div class="row detail-row">
                                <div class="col-1 colored-box"></div>
                                <div class="col-8 detail-name">
                                    {{ item.name }}
                                </div>
                                <div class="col-1">
                                    ¥{{ item.amount.toLocaleString() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<style scoped>
.container {
    width: 22rem
}
.border {
    border-bottom: 0.124rem solid #D6C494;
}

.detail-row {
    padding: 2% 2% 2% 1%;
    margin: 3% 6%;
    vertical-align: middle;
    border: 0.1rem solid #D6C494;
    background-color: #fff;
}

.colored-box {
    width: 2rem;  /* 幅 */
    height: 2rem; /* 高さ */
    background-color: #D5C6A7; /* 背景色 */
    border: 2px solid #D5C6A7; /* 枠線の色 */
}

.detail-name {
    margin-left: 3%;
}
</style>