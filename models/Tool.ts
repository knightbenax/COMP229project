import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ITool extends Document {
  name: string;
  category: string;
  description: string;
  condition: string;
  isAvailable: boolean;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const toolSchema = new Schema<ITool>(
  {
    name: {
      type: String,
      required: [true, 'Tool name is required'],
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },

    condition: {
      type: String,
      required: [true, 'Condition is required'],
      trim: true,
      maxlength: 100,
    },

    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tool = mongoose.model<ITool>('Tool', toolSchema);

export default Tool;