import mongoose, { Document, Schema } from 'mongoose';

// Project Template interface
export interface IProjectTemplate extends Document {
  _id: string;
  name: string;
  description: string;
  category: 'web-app' | 'mobile-app' | 'api' | 'data-science' | 'devops' | 'design' | 'marketing' | 'other';
  plans: Array<{
    name: string;
    description: string;
    tasks: Array<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      estimatedHours?: number;
      tags: string[];
    }>;
  }>;
  milestones: Array<{
    name: string;
    description: string;
    dueDateOffset: number; // Days from project start
  }>;
  tags: string[];
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Project Template schema
const ProjectTemplateSchema = new Schema<IProjectTemplate>({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    enum: ['web-app', 'mobile-app', 'api', 'data-science', 'devops', 'design', 'marketing', 'other'],
    required: true,
  },
  plans: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    tasks: [{
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: '',
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
      },
      estimatedHours: {
        type: Number,
        min: 0,
      },
      tags: [{
        type: String,
        trim: true,
      }],
    }],
  }],
  milestones: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    dueDateOffset: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.ProjectTemplate || mongoose.model<IProjectTemplate>('ProjectTemplate', ProjectTemplateSchema);
