import apiClient from "./api";

export const getApps = async () => {
    try {
      const response = await apiClient.get('app');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

export const checkDuplicateApp = async (name: string) => {
    try {
        const response = await apiClient.post('app/check', {
            name: name
        })
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createApp = async (name: string) => {
    try {
        const response = await apiClient.post('app', {
            name: name
        })
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateApp = async (arg: Array<object>) => {
    try {
        await apiClient.patch('app', arg);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchAppHistory = async () => {
    try {
        const response = await apiClient.get("app/history")
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createHistory = async (appID: number, amount: number, purchaseDate: Date) => {
    try {
        await apiClient.post('history', {
            app_id: appID,
            amount: amount,
            purchase_date: purchaseDate
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchBudgetByType = async (t: number) => {
    try {
        const response = await apiClient.get("budget/"+ t)
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchHistory = async () => {
    try {
        const response = await apiClient.get("history")
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
};