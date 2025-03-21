import supabase from "../config/supabaseClient.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = data.user; // Menyimpan data user di request
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
