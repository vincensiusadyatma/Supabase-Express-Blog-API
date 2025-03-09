import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Anon Key

// **Membuat instance Supabase client**
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, 
        autoRefreshToken: true 
    }
});

export default supabase;
