import supabase from "../config/supabaseClient.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Cari user lokal dari Prisma
    const user_uuid = data.user.id;

    const user = await prisma.user.findUnique({
      where: { user_uuid }
    });

    if (!user) {
      return res.status(404).json({ message: "User not registered in local database" });
    }

    // Simpan ke req.user agar bisa dipakai di controller
    req.user = {
      id: user.id,                // <- untuk relasi
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      user_uuid: user.user_uuid
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
