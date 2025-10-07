import mongoose, { Document, Schema } from 'mongoose';

// Project interface
export interface IProject extends Document {
  _id: string;
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  progress: number; // 0-100
  milestones: mongoose.Types.ObjectId[];
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project schema
const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  budget: {
    type: Number,
    min: 0,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  milestones: [{
    type: Schema.Types.ObjectId,
    ref: 'Milestone',
  }],
  template: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
