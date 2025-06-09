import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 [SUPABASE_CONFIG] Initializing Supabase client...');
console.log('🔧 [SUPABASE_CONFIG] URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('🔧 [SUPABASE_CONFIG] Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SUPABASE_CONFIG] Missing environment variables:');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('❌ [SUPABASE_CONFIG] Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ [SUPABASE_CONFIG] Error getting initial session:', error);
  } else {
    console.log('✅ [SUPABASE_CONFIG] Supabase client initialized successfully');
    console.log('🔐 [SUPABASE_CONFIG] Session status:', data.session ? 'Active' : 'No session');
  }
}).catch((error) => {
  console.error('❌ [SUPABASE_CONFIG] Failed to test Supabase connection:', error);
});

export type Database = {
  public: {
    Tables: {
      will_data: {
        Row: {
          id: string;
          user_id: string;
          personal_info: any;
          digital_assets: any;
          crypto_setup: any;
          beneficiaries: any;
          will_content: any;
          status: 'draft' | 'completed' | 'paid';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          personal_info?: any;
          digital_assets?: any;
          crypto_setup?: any;
          beneficiaries?: any;
          will_content?: any;
          status?: 'draft' | 'completed' | 'paid';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          personal_info?: any;
          digital_assets?: any;
          crypto_setup?: any;
          beneficiaries?: any;
          will_content?: any;
          status?: 'draft' | 'completed' | 'paid';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          session_data: any;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_data?: any;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_data?: any;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      cleanup_expired_sessions: {
        Args: {};
        Returns: void;
      };
    };
  };
};

// Helper functions for database operations
export const willDataService = {
  // Save will data to database
  async saveWillData(willData: any, userId: string) {
    console.log('💾 [DB_SERVICE] Saving will data for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('will_data')
        .upsert({
          user_id: userId,
          personal_info: willData.personalInfo || {},
          digital_assets: willData.digitalAssets || {},
          crypto_setup: willData.cryptoSetup || {},
          beneficiaries: willData.beneficiaries || {},
          will_content: willData.willContent || {},
          status: willData.status || 'draft',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [DB_SERVICE] Error saving will data:', error);
        throw error;
      }

      console.log('✅ [DB_SERVICE] Will data saved successfully:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [DB_SERVICE] Exception in saveWillData:', error);
      throw error;
    }
  },

  // Load will data from database
  async loadWillData(userId: string) {
    console.log('📥 [DB_SERVICE] Loading will data for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('will_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [DB_SERVICE] Error loading will data:', error);
        throw error;
      }

      if (data) {
        console.log('✅ [DB_SERVICE] Will data loaded successfully');
        return {
          personalInfo: data.personal_info,
          digitalAssets: data.digital_assets,
          cryptoSetup: data.crypto_setup,
          beneficiaries: data.beneficiaries,
          willContent: data.will_content,
          status: data.status,
          id: data.id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }

      console.log('ℹ️ [DB_SERVICE] No will data found for user');
      return null;
    } catch (error) {
      console.error('❌ [DB_SERVICE] Exception in loadWillData:', error);
      throw error;
    }
  },

  // Delete will data
  async deleteWillData(userId: string) {
    console.log('🗑️ [DB_SERVICE] Deleting will data for user:', userId);
    
    try {
      const { error } = await supabase
        .from('will_data')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [DB_SERVICE] Error deleting will data:', error);
        throw error;
      }

      console.log('✅ [DB_SERVICE] Will data deleted successfully');
    } catch (error) {
      console.error('❌ [DB_SERVICE] Exception in deleteWillData:', error);
      throw error;
    }
  },

  // Get will data by status
  async getWillDataByStatus(userId: string, status: 'draft' | 'completed' | 'paid') {
    console.log(`📊 [DB_SERVICE] Getting ${status} will data for user:`, userId);
    
    try {
      const { data, error } = await supabase
        .from('will_data')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status);

      if (error) {
        console.error('❌ [DB_SERVICE] Error getting will data by status:', error);
        throw error;
      }

      console.log(`✅ [DB_SERVICE] Found ${data.length} ${status} will records`);
      return data;
    } catch (error) {
      console.error('❌ [DB_SERVICE] Exception in getWillDataByStatus:', error);
      throw error;
    }
  },
};

// Session service for anonymous users
export const sessionService = {
  // Save session data
  async saveSession(sessionId: string, sessionData: any, userId?: string) {
    console.log('💾 [SESSION_SERVICE] Saving session:', sessionId);
    
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .upsert({
          id: sessionId,
          user_id: userId || null,
          session_data: sessionData,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [SESSION_SERVICE] Error saving session:', error);
        throw error;
      }

      console.log('✅ [SESSION_SERVICE] Session saved successfully');
      return data;
    } catch (error) {
      console.error('❌ [SESSION_SERVICE] Exception in saveSession:', error);
      throw error;
    }
  },

  // Load session data
  async loadSession(sessionId: string) {
    console.log('📥 [SESSION_SERVICE] Loading session:', sessionId);
    
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [SESSION_SERVICE] Error loading session:', error);
        throw error;
      }

      if (data) {
        console.log('✅ [SESSION_SERVICE] Session loaded successfully');
        return data.session_data;
      }

      console.log('ℹ️ [SESSION_SERVICE] No valid session found');
      return null;
    } catch (error) {
      console.error('❌ [SESSION_SERVICE] Exception in loadSession:', error);
      throw error;
    }
  },

  // Delete session
  async deleteSession(sessionId: string) {
    console.log('🗑️ [SESSION_SERVICE] Deleting session:', sessionId);
    
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('❌ [SESSION_SERVICE] Error deleting session:', error);
        throw error;
      }

      console.log('✅ [SESSION_SERVICE] Session deleted successfully');
    } catch (error) {
      console.error('❌ [SESSION_SERVICE] Exception in deleteSession:', error);
      throw error;
    }
  },
};