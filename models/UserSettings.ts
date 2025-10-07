import mongoose, { Document, Schema } from 'mongoose'

export interface ApiKey {
  provider: string
  model: string
  key: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IUserSettings extends Document {
  userId: string
  apiKeys: ApiKey[]
  preferences: {
    defaultModel: string
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const ApiKeySchema = new Schema<ApiKey>({
  provider: {
    type: String,
    required: true,
    enum: ['openai', 'anthropic', 'google', 'cohere', 'huggingface', 'replicate']
  },
  model: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const UserSettingsSchema = new Schema<IUserSettings>({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  apiKeys: [ApiKeySchema],
  preferences: {
    defaultModel: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.UserSettings || mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema)
