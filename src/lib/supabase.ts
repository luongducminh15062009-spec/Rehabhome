import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Access environment variables directly in React Native with Expo
const supabaseUrl = 'https://umwdfacqcpskhfspdtru.supabase.co';
const supabaseAnonKey = 'sb_publishable_qWyio58xdSjvEpGg7BufrQ_1i2fOkpf';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
