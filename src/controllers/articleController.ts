import { Request, Response } from "express";
import Article from "../models/article";
import cloudinary from "../config/cloudinary";

// Helper function to upload base64 image to Cloudinary
const uploadToCloudinary = async (
  base64String: string,
  folder: string = "pharmaeco/articles"
) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1600, height: 1200, crop: "limit" },
        { quality: "auto:good" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

// Create new article
export const createArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      author,
      references,
      introduction,
      subtitle1,
      content1,
      subtitle2,
      content2,
      subtitle3,
      content3,
      subtitle4,
      content4,
      subtitle5,
      content5,
      articleImage1,
      articleImage2,
      articleImage3,
      articleImage4,
      articleImage5,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !author ||
      !references ||
      !introduction ||
      !subtitle1 ||
      !content1 ||
      !articleImage1 ||
      !articleImage2
    ) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
      return;
    }

    // Upload images to Cloudinary
    const image1 = await uploadToCloudinary(articleImage1);
    const image2 = await uploadToCloudinary(articleImage2);

    let image3 = null;
    if (articleImage3) {
      image3 = await uploadToCloudinary(articleImage3);
    }

    let image4 = null;
    if (articleImage4) {
      image4 = await uploadToCloudinary(articleImage4);
    }

    let image5 = null;
    if (articleImage5) {
      image5 = await uploadToCloudinary(articleImage5);
    }

    // Create article
    const article = new Article({
      title,
      author,
      references,
      introduction,
      subtitle1,
      content1,
      subtitle2,
      content2,
      subtitle3,
      content3,
      subtitle4,
      content4,
      subtitle5,
      content5,
      articleImage1Url: image1.url,
      articleImage1Id: image1.publicId,
      articleImage2Url: image2.url,
      articleImage2Id: image2.publicId,
      articleImage3Url: image3?.url,
      articleImage3Id: image3?.publicId,
      articleImage4Url: image4?.url,
      articleImage4Id: image4?.publicId,
      articleImage5Url: image5?.url,
      articleImage5Id: image5?.publicId,
    });

    await article.save();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all articles
export const getAllArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Articles retrieved successfully",
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single article by ID
export const getArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Article retrieved successfully",
      data: article,
    });
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update article
export const updateArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      references,
      introduction,
      subtitle1,
      content1,
      subtitle2,
      content2,
      subtitle3,
      content3,
      subtitle4,
      content4,
      subtitle5,
      content5,
      articleImage1,
      articleImage2,
      articleImage3,
      articleImage4,
      articleImage5,
    } = req.body;

    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }

    // Update images if new base64 strings are provided
    let image1Data = {
      url: article.articleImage1Url,
      publicId: article.articleImage1Id,
    };
    if (articleImage1 && articleImage1.startsWith("data:")) {
      await deleteFromCloudinary(article.articleImage1Id);
      image1Data = await uploadToCloudinary(articleImage1);
    }

    let image2Data = {
      url: article.articleImage2Url,
      publicId: article.articleImage2Id,
    };
    if (articleImage2 && articleImage2.startsWith("data:")) {
      await deleteFromCloudinary(article.articleImage2Id);
      image2Data = await uploadToCloudinary(articleImage2);
    }

    let image3Data = {
      url: article.articleImage3Url,
      publicId: article.articleImage3Id,
    };
    if (articleImage3 && articleImage3.startsWith("data:")) {
      if (article.articleImage3Id) {
        await deleteFromCloudinary(article.articleImage3Id);
      }
      image3Data = await uploadToCloudinary(articleImage3);
    }

    let image4Data = {
      url: article.articleImage4Url,
      publicId: article.articleImage4Id,
    };
    if (articleImage4 && articleImage4.startsWith("data:")) {
      if (article.articleImage4Id) {
        await deleteFromCloudinary(article.articleImage4Id);
      }
      image4Data = await uploadToCloudinary(articleImage4);
    }

    let image5Data = {
      url: article.articleImage5Url,
      publicId: article.articleImage5Id,
    };
    if (articleImage5 && articleImage5.startsWith("data:")) {
      if (article.articleImage5Id) {
        await deleteFromCloudinary(article.articleImage5Id);
      }
      image5Data = await uploadToCloudinary(articleImage5);
    }
    // Update article
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        author,
        references,
        introduction,
        subtitle1,
        content1,
        subtitle2,
        content2,
        subtitle3,
        content3,
        subtitle4,
        content4,
        subtitle5,
        content5,
        articleImage1Url: image1Data.url,
        articleImage1Id: image1Data.publicId,
        articleImage2Url: image2Data.url,
        articleImage2Id: image2Data.publicId,
        articleImage3Url: image3Data.url,
        articleImage3Id: image3Data.publicId,
        articleImage4Url: image4Data.url,
        articleImage4Id: image4Data.publicId,
        articleImage5Url: image5Data.url,
        articleImage5Id: image5Data.publicId,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete article (Admin only)
export const deleteArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        message: "Article not found",
      });
      return;
    }

    // Delete images from Cloudinary
    await deleteFromCloudinary(article.articleImage1Id);
    await deleteFromCloudinary(article.articleImage2Id);

    if (article.articleImage3Id) {
      await deleteFromCloudinary(article.articleImage3Id);
    }

    if (article.articleImage4Id) {
      await deleteFromCloudinary(article.articleImage4Id);
    }

    if (article.articleImage5Id) {
      await deleteFromCloudinary(article.articleImage5Id);
    }

    // Delete article from database
    await Article.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
