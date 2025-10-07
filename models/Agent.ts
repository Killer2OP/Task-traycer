import mongoose, { Document, Schema } from 'mongoose';

// Agent interface
export interface IAgent extends Document {
  _id: string;
  name: string;
  description: string;
  type: 'code-reviewer' | 'task-executor' | 'bug-fixer' | 'documentation' | 'testing' | 'custom';
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  owner: mongoose.Types.ObjectId;
  assignedProjects: mongoose.Types.ObjectId[];
  assignedTasks: mongoose.Types.ObjectId[];
  configuration: {
    maxConcurrentTasks: number;
    workingHours: {
      start: string; // HH:MM format
      end: string;   // HH:MM format
    };
    autoAcceptTasks: boolean;
    priorityThreshold: 'low' | 'medium' | 'high' | 'urgent';
    skills: string[];
    aiModel: string;
    customInstructions?: string;
  };
  performance: {
    tasksCompleted: number;
    averageCompletionTime: number; // in hours
    successRate: number; // percentage
    lastActive: Date;
    totalHoursWorked: number;
    currentWorkload: number; // current active tasks
    efficiencyScore: number; // 0-100
    responseTime: number; // average response time in minutes
    qualityScore: number; // 0-100 based on task completion quality
  };
  createdAt: Date;
  updatedAt: Date;
}

// Agent schema
const AgentSchema = new Schema<IAgent>({
  name: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  type: {
    type: String,
    enum: ['code-reviewer', 'task-executor', 'bug-fixer', 'documentation', 'testing', 'custom'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'idle', 'busy', 'offline'],
    default: 'idle',
  },
  capabilities: [{
    type: String,
    trim: true,
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedProjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
  assignedTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  configuration: {
    maxConcurrentTasks: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      end: {
        type: String,
        default: '17:00',
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    autoAcceptTasks: {
      type: Boolean,
      default: false,
    },
    priorityThreshold: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    skills: [{
      type: String,
      trim: true,
    }],
    aiModel: {
      type: String,
      default: 'gpt-4',
    },
    customInstructions: {
      type: String,
      trim: true,
    },
  },
  performance: {
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    averageCompletionTime: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    totalHoursWorked: {
      type: Number,
      default: 0,
    },
    currentWorkload: {
      type: Number,
      default: 0,
    },
    efficiencyScore: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    responseTime: {
      type: Number,
      default: 30, // minutes
    },
    qualityScore: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
  },
}, {
  timestamps: true,
});

// Export the model
export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
