import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  title: string;
  author: string;
  caption: string;
  subtitle1: string;
  content1: string;
  subtitle2?: string;
  content2?: string;
  subtitle3?: string;
  content3?: string;
  subtitle4?: string;
  content4?: string;
  articleImage1Url: string;
  articleImage1Id: string;
  articleImage2Url: string;
  articleImage2Id: string;
  articleImage3Url?: string;
  articleImage3Id?: string;
  articleImage4Url?: string;
  articleImage4Id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle1: {
      type: String,
      required: true,
      trim: true,
    },
    content1: {
      type: String,
      required: true,
    },
    subtitle2: {
      type: String,
      trim: true,
    },
    content2: {
      type: String,
    },
    subtitle3: {
      type: String,
      trim: true,
    },
    content3: {
      type: String,
    },
    subtitle4: {
      type: String,
      trim: true,
    },
    content4: {
      type: String,
    },
    articleImage1Url: {
      type: String,
      required: true,
    },
    articleImage1Id: {
      type: String,
      required: true,
    },
    articleImage2Url: {
      type: String,
      required: true,
    },
    articleImage2Id: {
      type: String,
      required: true,
    },
    articleImage3Url: {
      type: String,
    },
    articleImage3Id: {
      type: String,
    },
    articleImage4Url: {
      type: String,
    },
    articleImage4Id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IArticle>("Article", ArticleSchema);
