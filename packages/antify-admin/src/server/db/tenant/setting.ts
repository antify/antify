import { Schema } from 'mongoose';

export interface Setting {
  language: String;
}

export const settingSchema = new Schema<Setting>(
  {
    language: {
      type: String,
      default: 'DE',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
