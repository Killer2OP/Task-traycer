import mongoose, { Document, Schema } from 'mongoose';

// Comment interface
export interface IComment extends Document {
  _id: string;
  content: string;
  author: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Comment schema
const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
