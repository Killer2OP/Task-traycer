import mongoose, { Document, Schema } from 'mongoose';

// Plan interface
export interface IPlan extends Document {
  _id: string;
  name: string;
  description: string;
  project: mongoose.Types.ObjectId;
  tasks: mongoose.Types.ObjectId[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Plan schema
const PlanSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
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
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  estimatedHours: {
    type: Number,
    min: 0,
  },
  actualHours: {
    type: Number,
    min: 0,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
