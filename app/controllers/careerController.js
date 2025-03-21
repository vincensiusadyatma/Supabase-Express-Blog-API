import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabaseClient.js";

const prisma = new PrismaClient();

/**
 * @route POST /career
 * @desc  Upload image to career
 */
const store = async (req, res) => {
  try {
    const { caption, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Missing required image file" });
    }

    // Upload gambar ke Supabase
    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `career_images/${uuidv4()}.${fileExt}`;

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


    const careerItem = await prisma.career.create({
      data: {
        career_uuid: uuidv4(), 
        image_url: publicUrlData.publicUrl, 
        caption: caption || null, 
        link: link || null, 
      },
    });

    return res.status(201).json({
      message: "Career image uploaded successfully",
      data: careerItem,
    });
  } catch (error) {
    console.error("🛠️ Error in store function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route GET /career
 * @desc  Get all career images
 */
const index = async (req, res) => {
  try {
    const careerItems = await prisma.career.findMany();

    return res.status(200).json({ message: "Success", data: careerItems });
  } catch (error) {
    console.error("🛠️ Error in index function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route GET /career/:id
 * @desc  Get single career image
 */
const show = async (req, res) => {
  try {
    const { id } = req.params;

    const careerItem = await prisma.career.findUnique({
      where: { career_uuid: id },
    });

    if (!careerItem) {
      return res.status(404).json({ message: "Career image not found" });
    }

    return res.status(200).json({ message: "Success", data: careerItem });
  } catch (error) {
    console.error("🛠️ Error in show function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route DELETE /career/:id
 * @desc  Delete career image
 */
const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCareerItem = await prisma.career.findUnique({
      where: { career_uuid: id },
    });

    if (!existingCareerItem) {
      return res.status(404).json({ message: "Career image not found" });
    }

    // Hapus gambar dari Supabase
    const filePath = existingCareerItem.image_url.split(`${process.env.SUPABASE_URL}/storage/v1/object/public/`)[1];
    await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([filePath]);

    // Hapus dari database
    await prisma.career.delete({ where: { career_uuid: id } });

    return res.status(200).json({ message: "Career image deleted successfully" });
  } catch (error) {
    console.error("🛠️ Error in destroy function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route PUT /career/:id
 * @desc  Update career image (caption dan/atau image, opsional)
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, link } = req.body;

    // Cek if career data founded
    const existingCareerItem = await prisma.career.findUnique({
      where: { career_uuid: id },
    });

    if (!existingCareerItem) {
      return res.status(404).json({ message: "Career image not found" });
    }

    let imageUrl = existingCareerItem.image_url; 

    if (req.file) {
      try {
        const filePath = existingCareerItem.image_url.split(`${process.env.SUPABASE_URL}/storage/v1/object/public/`)[1];
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([filePath]);
      } catch (deleteError) {
        console.error("🛠️ Error deleting old image:", deleteError.message);
      }

   
      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      const fileName = `career_images/${uuidv4()}.${fileExt}`;

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


    const updatedCareerItem = await prisma.career.update({
      where: { career_uuid: id },
      data: {
        caption: caption !== undefined ? caption : existingCareerItem.caption,
        link: link !== undefined ? link : existingCareerItem.link,
        image_url: imageUrl, 
      },
    });

    return res.status(200).json({
      message: "Career image updated successfully",
      data: updatedCareerItem,
    });
  } catch (error) {
    console.error("🛠️ Error in update function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export { store, index, show, destroy, update };
