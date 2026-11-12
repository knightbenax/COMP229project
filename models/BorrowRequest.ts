
import mongoose, { Schema, type Document, type Types } from 'mongoose';

// Defines the structure of a borrow request
export interface IBorrowRequest extends Document {
  borrower: Types.ObjectId;
  tool: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Defines the MongoDB schema
const borrowRequestSchema = new Schema<IBorrowRequest>(
  {
    borrower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tool: {
      type: Schema.Types.ObjectId,
      ref: 'Tool',
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Validate that the end date is later than the start date
borrowRequestSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be later than start date');
  }

  next();
});

// Create the Mongoose model
const BorrowRequest = mongoose.model<IBorrowRequest>(
  'BorrowRequest',
  borrowRequestSchema
);

export default BorrowRequest;
