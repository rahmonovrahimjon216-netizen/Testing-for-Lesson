// Pure native fetch-based Supabase client (Zero node_modules dependency)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edfespkhfrnppoxcjphr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_t1t1bxwzkp0122HWFnaXKA_hvPdLeFj';

const getHeaders = (extraHeaders = {}) => ({
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${localStorage.getItem('qarzdaftar_jwt_token') || supabaseAnonKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
  ...extraHeaders
});

export const supabase = {
  // REST API table query builder
  from: (table) => {
    return {
      select: (columns = '*') => {
        let url = `${supabaseUrl}/rest/v1/${table}?select=${columns}`;
        const queryObj = {
          order: (column, { ascending = true } = {}) => {
            url += `&order=${column}.${ascending ? 'asc' : 'desc'}`;
            return queryObj;
          },
          eq: (column, value) => {
            url += `&${column}=eq.${encodeURIComponent(value)}`;
            return queryObj;
          },
          then: async (resolve, reject) => {
            try {
              const res = await fetch(url, { headers: getHeaders() });
              if (!res.ok) {
                const errData = await res.json().catch(() => ({ message: res.statusText }));
                resolve({ data: null, error: errData });
                return;
              }
              const data = await res.json();
              resolve({ data, error: null });
            } catch (err) {
              resolve({ data: null, error: err });
            }
          }
        };
        return queryObj;
      },

      upsert: (payload) => {
        const url = `${supabaseUrl}/rest/v1/${table}`;
        const records = Array.isArray(payload) ? payload : [payload];
        return {
          select: () => ({
            single: async () => {
              try {
                const res = await fetch(url, {
                  method: 'POST',
                  headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
                  body: JSON.stringify(records)
                });
                const data = await res.json();
                return { data: Array.isArray(data) ? data[0] : data, error: null };
              } catch (err) {
                return { data: null, error: err };
              }
            }
          }),
          then: async (resolve) => {
            try {
              const res = await fetch(url, {
                method: 'POST',
                headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
                body: JSON.stringify(records)
              });
              const data = res.ok ? await res.json().catch(() => ({})) : null;
              resolve({ data, error: res.ok ? null : { message: res.statusText } });
            } catch (err) {
              resolve({ data: null, error: err });
            }
          }
        };
      },

      delete: () => {
        return {
          eq: (column, value) => {
            const url = `${supabaseUrl}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}`;
            return {
              then: async (resolve) => {
                try {
                  const res = await fetch(url, {
                    method: 'DELETE',
                    headers: getHeaders()
                  });
                  resolve({ error: res.ok ? null : { message: res.statusText } });
                } catch (err) {
                  resolve({ error: err });
                }
              }
            };
          }
        };
      }
    };
  },

  // Auth API
  auth: {
    signUp: async ({ email, password, options = {} }) => {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            email,
            password,
            data: options.data || {}
          })
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: data };
        return {
          data: {
            user: data.user || data,
            session: { access_token: data.access_token || data.session?.access_token }
          },
          error: null
        };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    signInWithPassword: async ({ email, password }) => {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: data };
        return {
          data: {
            user: data.user,
            session: { access_token: data.access_token }
          },
          error: null
        };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    signOut: async () => {
      try {
        await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: getHeaders()
        });
      } catch (e) {
        console.warn(e);
      }
    }
  }
};

export const isSupabaseConfigured = () => true;
