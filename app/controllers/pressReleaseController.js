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

    if (!title || !date || !time || !contents) {
      return res.status(400).json({ message: "Validation failed", errors: "Missing required fields" });
    }

    const pressRelease = await prisma.pressRelease.create({
      data: {
        title,
        press_uuid: uuidv4(),
        date: new Date(date),
        time: new Date(`1970-01-01T${time}:00Z`),
      },
    });

    const parsedContents = JSON.parse(contents);
    let pressContents = [];

    for (let i = 0; i < parsedContents.length; i++) {
      const contentData = parsedContents[i];
      let imageUrl = null;

      if (req.files[i]) {
        const file = req.files[i];
        const fileExt = file.originalname.split(".").pop();
        const fileName = `press_images/${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const pressContent = await prisma.pressReleaseContent.create({
        data: {
          pressReleaseId: pressRelease.id,
          content: contentData.content || null,
          imageUrl: imageUrl,
        },
      });

      pressContents.push(pressContent);
    }

    return res.status(201).json({
      message: "Press release created successfully",
      data: {
        ...pressRelease,
        contents: pressContents,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
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
    const { id } = req.params; //uuid
    const { title, date, time, contents } = req.body;

    console.log("🛠️ Checking received ID for update:", id);

    if (!id) {
      return res.status(400).json({ message: "Missing UUID in request" });
    }

 
    const existingPressRelease = await prisma.pressRelease.findUnique({
      where: { press_uuid: id },
      include: { pressReleaseContents: true }, // Ambil konten lama
    });

    if (!existingPressRelease) {
      return res.status(404).json({ message: "Press release not found" });
    }


    const updatedPressRelease = await prisma.pressRelease.update({
      where: { press_uuid: id },
      data: {
        title: title || existingPressRelease.title,
        date: date ? new Date(date) : existingPressRelease.date,
        time: time ? new Date(`1970-01-01T${time}:00Z`) : existingPressRelease.time,
      },
    });

    let updatedContents = []; 

    if (contents) {
      const parsedContents = typeof contents === "string" ? JSON.parse(contents) : contents;
      await prisma.pressReleaseContent.deleteMany({ where: { pressReleaseId: existingPressRelease.id } });

      for (let i = 0; i < parsedContents.length; i++) {
        const contentData = parsedContents[i];
        let imageUrl = null;

    
        if (req.files && req.files[i]) {
          const file = req.files[i];
          const fileExt = file.originalname.split(".").pop();
          const fileName = `press_images/${uuidv4()}.${fileExt}`;

          const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });

          if (error) throw error;

          const { data: publicUrlData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(fileName);
          imageUrl = publicUrlData.publicUrl;
        } else {
       
          imageUrl = existingPressRelease.pressReleaseContents[i]?.imageUrl || null;
        }

        // Simpan konten baru
        const pressContent = await prisma.pressReleaseContent.create({
          data: {
            pressReleaseId: existingPressRelease.id,
            content: contentData.content || null,
            imageUrl: imageUrl,
          },
        });

        updatedContents.push(pressContent);
      }
    } else {

      updatedContents = existingPressRelease.pressReleaseContents;
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
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export { store, index, show, destroy, update };
