import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeInAsyncStorage = async (key: string, value: string) => {
  try {
    console.log('storing ' + key);
    await AsyncStorage.setItem(key, value);
    console.log('done');
  } catch (e) {
    console.log('save' + key + ' error', e);
  }
};

export const getFromAsyncStorage = async (key: string) => {
  try {
    console.log('getting ' + key);
    const ans = await AsyncStorage.getItem(key);
    console.log('done');
    if (!ans) {
      return 'No ' + key;
    }
    return ans;
  } catch (e) {
    console.log(e);
    return 'Error';
  }
};

export const clearToken = async () => {
  await AsyncStorage.clear();
};
