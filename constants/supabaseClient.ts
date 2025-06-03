import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdjflerlamrwdkzkzyjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamZsZXJsYW1yd2Rremt6eWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NzU4MDksImV4cCI6MjA1NzM1MTgwOX0.xnRIJFJm82BNk_k4c_FGNEqM3NluyN5jyQ7v2UOQNcM';

export const supabase = createClient(supabaseUrl, supabaseKey);
