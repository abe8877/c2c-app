import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function checkCount() {
    const { count, error } = await supabase
        .from('creators')
        .select('*', { count: 'exact', head: true })

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Total creators in DB:', count)

    const { data: dataRange, error: errorRange } = await supabase
        .from('creators')
        .select('id')
        .range(0, 1500)

    if (errorRange) {
        console.error('Range error:', errorRange)
    } else {
        console.log('Fetched with range(0, 1500):', dataRange?.length)
    }
}

checkCount()
