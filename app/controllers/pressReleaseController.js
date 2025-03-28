import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabaseClient.js";

const prisma = new PrismaClient();

/**
 * @route POST /press
 * @desc  Create new press release
 */
const store = async (req, res) => {
  try {
    const { title, date, time, contents } = req.body;

    // Debug awal
    console.log("🔥 req.body.contents:", contents);
    console.log("📂 req.files:", req.files?.map(f => f.fieldname));

    // Validasi input utama
    if (!title || !date || !time || !contents) {
      return res.status(400).json({
        message: "Validation failed",
        errors: "Missing required fields",
      });
    }

    // Buat press release utama
    const pressRelease = await prisma.pressRelease.create({
      data: {
        title,
        press_uuid: uuidv4(),
        date: new Date(date),
        time: new Date(`1970-01-01T${time}:00Z`),
      },
    });

    // Parse contents (kalau pake string, convert ke object)
    const parsedContents = typeof contents === "string"
      ? JSON.parse(contents)
      : contents;

    const pressContents = [];

    for (let i = 0; i < parsedContents.length; i++) {
      const contentData = parsedContents[i];
      const contentText = contentData?.content?.trim() || null;

      const imageField = `contents[${i}][image]`;
      const file = req.files?.find((f) => f.fieldname === imageField);

      let imageUrl = null;

      if (file) {
        const fileExt = file.originalname.split(".").pop();
        const fileName = `press_images/${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const saved = await prisma.pressReleaseContent.create({
        data: {
          pressReleaseId: pressRelease.id,
          content: contentText,
          imageUrl: imageUrl,
        },
      });

      await prisma.pressReleaseCreator.create({
        data: {
          userId: req.user.id,            
          pressReleaseId: pressRelease.id
        }
      });
      

      pressContents.push(saved); 
      console.log(`✅ Saved content[${i}]:`, saved);
    }

    return res.status(201).json({
      message: "Press release created successfully",
      data: {
        ...pressRelease,
        contents: pressContents,
      },
    });
  } catch (error) {
    console.error("❌ Error creating press release:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


/**
 * @route GET /press
 * @desc  Get all press releases
 */
const index = async (req, res) => {
  try {
    const pressReleases = await prisma.pressRelease.findMany({
      include: { pressReleaseContents: false },
    });

    return res.status(200).json({ message: "Success", data: pressReleases });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route GET /press/:id
 * @desc  Get a single press release
 */
const show = async (req, res) => {
    try {
      const { id } = req.params;
  
      const pressRelease = await prisma.pressRelease.findUnique({
        where: { press_uuid: id },
        include: { pressReleaseContents: true },
      });
  
      if (!pressRelease) {
        return res.status(404).json({ message: "Press release not found" });
      }
  
      return res.status(200).json({ message: "Success", data: pressRelease });
    } catch (error) {
      console.error("🛠️ Error in show function:", error);
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  

/**
 * @route DELETE /press/:id
 * @desc  Delete a press release
 */
const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pressReleaseContent.deleteMany({ where: { pressReleaseId: Number(id) } });
    await prisma.pressRelease.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Press release deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const update = async (req, res) => {
  try {
    const { id } = req.params; // UUID
    const { title, date, time, contents } = req.body;

    console.log("🛠️ Updating press release with ID:", id);

    if (!id) {
      return res.status(400).json({ message: "Missing UUID in request" });
    }

    // Ambil press release lama
    const existingPressRelease = await prisma.pressRelease.findUnique({
      where: { press_uuid: id },
      include: { pressReleaseContents: true },
    });

    if (!existingPressRelease) {
      return res.status(404).json({ message: "Press release not found" });
    }

    // Update press release utamanya
    const updatedPressRelease = await prisma.pressRelease.update({
      where: { press_uuid: id },
      data: {
        title: title || existingPressRelease.title,
        date: date ? new Date(date) : existingPressRelease.date,
        time: time ? new Date(`1970-01-01T${time}:00Z`) : existingPressRelease.time,
      },
    });

    const updatedContents = [];

    // Hapus semua konten sebelumnya
    await prisma.pressReleaseContent.deleteMany({
      where: { pressReleaseId: existingPressRelease.id },
    });

    // Parse konten baru 
    const parsedContents = typeof contents === "string"
      ? JSON.parse(contents)
      : contents;

    for (let i = 0; i < parsedContents.length; i++) {
      const contentBlock = parsedContents[i];
      const contentText = contentBlock?.content?.trim() || null;

      // Cari file berdasarkan pola nama: contents[0][image], contents[1][image] biar ez
      const imageField = `contents[${i}][image]`;
      const file = req.files?.find(f => f.fieldname === imageField);

      let imageUrl = null;

      if (file) {
        const fileExt = file.originalname.split(".").pop();
        const fileName = `press_images/${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      // Save hehe
      const newContent = await prisma.pressReleaseContent.create({
        data: {
          pressReleaseId: existingPressRelease.id,
          content: contentText,
          imageUrl: imageUrl,
        },
      });

      updatedContents.push(newContent);
    }

    return res.status(200).json({
      message: "Press release updated successfully",
      data: {
        ...updatedPressRelease,
        contents: updatedContents,
      },
    });

  } catch (error) {
    console.error("🛠️ Error in update function:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const getPressByUser = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: 'Missing user UUID in URL' });
    }

    const user = await prisma.user.findUnique({ where: { user_uuid: uuid } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const creatorRecords = await prisma.pressReleaseCreator.findMany({
      where: {
        userId: user.id
      },
      include: {
        pressRelease: {
          include: {
            pressReleaseContents: false
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Hanya ambil array dari pressRelease-nya saja :v
    const pressList = creatorRecords.map(r => r.pressRelease);

    return res.status(200).json({
      success: true,
      data: pressList
    });

  } catch (error) {
    console.error("❌ Error in getPressByUser:", error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export { store, index, show, destroy, update, getPressByUser };
