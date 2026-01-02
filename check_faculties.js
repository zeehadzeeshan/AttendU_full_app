
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../frontend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkFaculties() {
    console.log('Checking faculties...');
    const { data, error } = await supabase.from('faculties').select('*');
    if (error) {
        console.error('Error fetching faculties:', error);
    } else {
        console.log(`Found ${data.length} faculties:`);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkFaculties();
