// 🌞 Yellow Solaris - Supabase Client
import { createClient } from '@supabase/supabase-js';

// Your Supabase project credentials
const supabaseUrl = 'https://bdxzwwhccxvyvnhfaoyx.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkeHp3d2hjY3h2eXZuaGZhb3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MjUxMzgsImV4cCI6MjA3NzIwMTEzOH0.kfVX4-9cOe7FUHqhTtPFvcxLHUQbZ6j1z7RoiveU96g';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
