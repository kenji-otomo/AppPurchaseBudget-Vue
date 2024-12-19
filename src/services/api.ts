import axios from 'axios';

// ベース URL を設定
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // 実際のAPIのURLに変更
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient