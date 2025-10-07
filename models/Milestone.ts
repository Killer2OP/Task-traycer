import mongoose, { Document, Schema } from 'mongoose';

// Milestone interface
export interface IMilestone extends Document {
  _id: string;
  name: string;
  description: string;
  project: mongoose.Types.ObjectId;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  tasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Milestone schema
const MilestoneSchema = new Schema<IMilestone>({
  name: {
    type: String,
    required: [true, 'Milestone name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending',
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);
