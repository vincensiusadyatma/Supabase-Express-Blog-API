import supabase from '../config/supabaseClient.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const accessToken = req.query.access_token;
    const refreshToken = req.query.refresh_token;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Access token is required' });
    }

    const { data: data_token, error: error_token } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: 'Failed to get user from token' });
    }

    const {
      id: user_uuid,
      email,
      user_metadata: { name, full_name }
    } = data.user;

    const username = email?.split('@')[0] || user_uuid;
    const fullname = full_name || name || username;

    // 🔄 Simpan atau update user ke database lokal
    const existingUser = await prisma.user.findUnique({ where: { user_uuid } });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          user_uuid,
          email,
          username,
          fullname,
          status: true
        }
      });
    } else {
      await prisma.user.update({
        where: { user_uuid },
        data: {
          email,
          username,
          fullname
        }
      });
    }

    // Hitung expired token
    const { access_token, refresh_token, expires_in, expires_at } = data_token.session;
    const expires_at_timestamp = Math.floor(Date.now() / 1000) + expires_in;
    const expire_date = new Date(expires_at_timestamp * 1000).toISOString();

    return res.json({
      status: 200,
      success: true,
      token: { accessToken, refreshToken, expires_in, expires_at, expire_date },
      user: { user_uuid, email, username, fullname }
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
