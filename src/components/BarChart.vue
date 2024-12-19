<template>
    <Bar :data="data" :options="options" />
</template>

<script setup="ts">
import { ref } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  labels: {
    type: Array,
    default: []
  },
  data: {
    type: Array,
    default: []
  },
  backgroundColor: {
    type: String,
    default: '#E2E2E2'
  }
});

const data = ref({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      backgroundColor: props.backgroundColor,
      data: props.data
    }
  ]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
      legend: {
          display: props.title ? true : false,
          align: 'start',
          labels: {
              boxWidth: 0
          }
      }
  },
  scales: {
      y: {
          ticks: {
              stepSize: 1000
          }
      }
  }
});

</script>