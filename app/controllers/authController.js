import supabase from '../config/supabaseClient.js';

/**
 * **🔹 Login dengan Google**
 */
const loginWithGoogle = async (req, res) => {
    try {
      const host = `${req.protocol}://${req.get('host')}`;
      const redirectUrl = req.query.redirectUrl || `${host}/auth.html`; 

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          shouldCreateUser: true,
          flowType: 'pkce'
        },
      });

      if (error) {
        return res.status(400).json({ success: false, message: 'Login gagal: ' + error.message });
      }

      res.redirect(data.url);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


/**
 * **🔹 Authenticate User & Get Data**
 */
const authenticateUser = async (req, res) => {
    try {
      let accessToken = req.query.access_token; 
      let refreshToken = req.query.refresh_token; 

      console.log('Access Token Received:', accessToken);
      console.log('Refresh Token Received:', refreshToken);

      if (!accessToken) {
        return res.status(400).json({ success: false, message: 'Access token is required' });
      }

      // **Set new session with acces tokenn and refresh token**
      const { data: data_token, error: error_token } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      // **2. retreieve user data from acces token**
      let { data, error } = await supabase.auth.getUser(accessToken);

      
      // **retreive some user data and token**
      const { id, email, user_metadata: { name, full_name, avatar_url } } = data.user;
      const { access_token, refresh_token, expires_in, expires_at } = data_token.session;

      // cast unix time of expired time token to date
      const expires_at_timestamp = Math.floor(Date.now() / 1000) + expires_in;
      const expires_at_date = new Date(expires_at_timestamp * 1000)
      const expire_date = expires_at_date.toISOString();

      return res.json({
        status: 200,
        success: true,
        // newToken: data_token.session
        token: { accessToken, refreshToken, expires_in, expires_at, expire_date },
        user: { id, email, name, full_name, avatar_url },
      });

    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const logoutUser = async (req, res) => {
    try {
    
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
      }


      const { access_token } = req.body;

      if (!access_token) {
        return res.status(400).json({ success: false, message: 'Access token is required for logout' });
      }

      
      const { error } = await supabase.auth.admin.signOut(access_token);

      if (error) {
        console.error('Logout error:', error.message);
        return res.status(400).json({ success: false, message: 'Logout failed', error: error.message });
      }

      return res.status(200).json({ success: true, message: 'Logout successful' });

    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};





export {loginWithGoogle, authenticateUser,logoutUser};
