import mongoose, { Document, Schema } from 'mongoose';

// Task interface
export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  plan: mongoose.Types.ObjectId;
  dependencies: mongoose.Types.ObjectId[];
  assignee?: mongoose.Types.ObjectId;
  agentAssignee?: mongoose.Types.ObjectId; // AI Agent assigned to task
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  comments: mongoose.Types.ObjectId[];
  subtasks: mongoose.Types.ObjectId[];
  milestone?: mongoose.Types.ObjectId;
  // Agent workflow tracking
  agentWorkflow: {
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    agentNotes?: string;
    progressPercentage: number;
    lastActivityAt?: Date;
    aiResponse?: string;
    estimatedCompletionTime?: Date;
    blockers?: string[];
    autoProgressUpdates: Array<{
      timestamp: Date;
      status: string;
      note?: string;
      progressPercentage: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Task schema
const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'blocked', 'cancelled'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  agentAssignee: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
  },
  dueDate: {
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
  tags: [{
    type: String,
    trim: true,
  }],
  attachments: [{
    type: String,
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  subtasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  milestone: {
    type: Schema.Types.ObjectId,
    ref: 'Milestone',
  },
  agentWorkflow: {
    assignedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    agentNotes: {
      type: String,
      trim: true,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    aiResponse: {
      type: String,
      trim: true,
    },
    estimatedCompletionTime: {
      type: Date,
    },
    blockers: [{
      type: String,
      trim: true,
    }],
    autoProgressUpdates: [{
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        required: true,
      },
      note: {
        type: String,
        trim: true,
      },
      progressPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    }],
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
