// Supabase configuration and client initialization
const SUPABASE_URL = 'https://lxslwibjxarfbshleiyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c2x3aWJqeGFyZmJzaGxlaXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0ODc3NzMsImV4cCI6MjA3MTA2Mzc3M30.qJhMexo5i4wbPYp8I_b0ugMOO9nclo-TysjkVaSnW6Y';

// Initialize Supabase client with error handling
let supabaseClient = null;
let isSupabaseAvailable = false;

try {
  if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isSupabaseAvailable = true;
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase library not available. Falling back to localStorage.');
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
  isSupabaseAvailable = false;
}

/**
 * Check if Supabase is available
 * @returns {boolean} True if Supabase is available
 */
function isSupabaseReady() {
  return isSupabaseAvailable && supabaseClient !== null;
}

/**
 * Fetch all locks for a specific user
 * @param {string} userEmail - The user's email address (used as user_id)
 * @returns {Promise<Array>} Array of lock objects or empty array
 */
async function fetchUserLocks(userEmail) {
  if (!isSupabaseReady()) {
    console.log('Supabase not available, falling back to localStorage');
    // Fallback to localStorage for demo purposes
    const users = JSON.parse(localStorage.getItem('tikstake_users') || '[]');
    const user = users.find(u => u.email === userEmail);
    return user ? user.locks || [] : [];
  }

  try {
    const { data, error } = await supabaseClient
      .from('locks')
      .select('*')
      .eq('user_id', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user locks:', error);
      return [];
    }

    console.log('Fetched locks from Supabase:', data);
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching user locks:', err);
    return [];
  }
}

/**
 * Add a new lock for a user
 * @param {string} userEmail - The user's email address (used as user_id)
 * @param {Object} lockData - The lock data object
 * @returns {Promise<boolean>} Success status
 */
async function addUserLock(userEmail, lockData) {
  if (!isSupabaseReady()) {
    console.log('Supabase not available, would need to implement localStorage fallback for adding locks');
    return false;
  }

  try {
    const lockWithUserId = {
      user_id: userEmail,
      ...lockData
    };

    const { data, error } = await supabaseClient
      .from('locks')
      .insert([lockWithUserId])
      .select();

    if (error) {
      console.error('Error adding user lock:', error);
      return false;
    }

    console.log('Lock added successfully:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error adding user lock:', err);
    return false;
  }
}

/**
 * Update an existing lock for a user
 * @param {number} lockId - The lock ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<boolean>} Success status
 */
async function updateUserLock(lockId, updateData) {
  if (!isSupabaseReady()) {
    console.log('Supabase not available, would need to implement localStorage fallback for updating locks');
    return false;
  }

  try {
    const { data, error } = await supabaseClient
      .from('locks')
      .update(updateData)
      .eq('id', lockId)
      .select();

    if (error) {
      console.error('Error updating user lock:', error);
      return false;
    }

    console.log('Lock updated successfully:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error updating user lock:', err);
    return false;
  }
}

/**
 * Delete a lock for a user
 * @param {number} lockId - The lock ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteUserLock(lockId) {
  if (!isSupabaseReady()) {
    console.log('Supabase not available, would need to implement localStorage fallback for deleting locks');
    return false;
  }

  try {
    const { error } = await supabaseClient
      .from('locks')
      .delete()
      .eq('id', lockId);

    if (error) {
      console.error('Error deleting user lock:', error);
      return false;
    }

    console.log('Lock deleted successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error deleting user lock:', err);
    return false;
  }
}