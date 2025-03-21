import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabaseClient.js";

const prisma = new PrismaClient();

/**
 * @route POST /gallery
 * @desc  Upload image to gallery
 */
const store = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Missing required image file" });
    }

    // Upload gambar ke Supabase
    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `gallery_images/${uuidv4()}.${fileExt}`;

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


    const galleryItem = await prisma.gallery.create({
      data: {
        gallery_uuid: uuidv4(),
        image_url: publicUrlData.publicUrl, 
        caption: caption || null, 
      },
    });

    return res.status(201).json({
      message: "Gallery image uploaded successfully",
      data: galleryItem,
    });
  } catch (error) {
    console.error("🛠️ Error in store function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route GET /gallery
 * @desc  Get all gallery images
 */
const index = async (req, res) => {
  try {
    const galleryItems = await prisma.gallery.findMany();

    return res.status(200).json({ message: "Success", data: galleryItems });
  } catch (error) {
    console.error("🛠️ Error in index function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route GET /gallery/:id
 * @desc  Get single gallery image
 */
const show = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await prisma.gallery.findUnique({
      where: { gallery_uuid: id },
    });

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    return res.status(200).json({ message: "Success", data: galleryItem });
  } catch (error) {
    console.error("🛠️ Error in show function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route DELETE /gallery/:id
 * @desc  Delete gallery image
 */
const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const existingGalleryItem = await prisma.gallery.findUnique({
      where: { gallery_uuid: id },
    });

    if (!existingGalleryItem) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    // delete from supabase
    const filePath = existingGalleryItem.image_url.split(`${process.env.SUPABASE_URL}/storage/v1/object/public/`)[1];
    await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([filePath]);

    // delete from database
    await prisma.gallery.delete({ where: { gallery_uuid: id } });

    return res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("🛠️ Error in destroy function:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @route PUT /gallery/:id
 * @desc 
 */
const update = async (req, res) => {
    try {
      const { id } = req.params;
      const { caption } = req.body;

      const existingGalleryItem = await prisma.gallery.findUnique({
        where: { gallery_uuid: id },
      });
  
      if (!existingGalleryItem) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
  
      let imageUrl = existingGalleryItem.image_url; 
  
      // if request new image, then delete old image
      if (req.file) {
        try {
     
          const filePath = existingGalleryItem.image_url.split(`${process.env.SUPABASE_URL}/storage/v1/object/public/`)[1];
          await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([filePath]);
        } catch (deleteError) {
          console.error("🛠️ Error deleting old image:", deleteError.message);
        }
  
        // Upload gambar baru ke Supabase
        const file = req.file;
        const fileExt = file.originalname.split(".").pop();
        const fileName = `gallery_images/${uuidv4()}.${fileExt}`;
  
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
  
    
      const updatedGalleryItem = await prisma.gallery.update({
        where: { gallery_uuid: id },
        data: {
          caption: caption !== undefined ? caption : existingGalleryItem.caption, 
          image_url: imageUrl,
        },
      });
  
      return res.status(200).json({
        message: "Gallery image updated successfully",
        data: updatedGalleryItem,
      });
    } catch (error) {
      console.error("🛠️ Error in update function:", error);
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  

export { store, index, show, destroy,update };
