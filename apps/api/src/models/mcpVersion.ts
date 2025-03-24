import mongoose, { Document, Schema } from 'mongoose';

// MCP Function interface
interface IMcpFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    description: string;
    required?: boolean;
    schema?: any;
  }[];
  returnType?: string;
  returnDescription?: string;
  examples?: string[];
}

// MCP Version Document interface
export interface IMcpVersion extends Document {
  mcpId: mongoose.Types.ObjectId;
  version: string;
  description: string;
  changeNotes: string;
  apiSchema: string;
  implementationCode: string;
  functions: IMcpFunction[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

// MCP Function schema
const McpFunctionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  parameters: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      schema: {
        type: Schema.Types.Mixed,
      },
    },
  ],
  returnType: {
    type: String,
  },
  returnDescription: {
    type: String,
  },
  examples: [String],
});

// MCP Version schema
const McpVersionSchema = new Schema<IMcpVersion>(
  {
    mcpId: {
      type: Schema.Types.ObjectId,
      ref: 'MCP',
      required: true,
    },
    version: {
      type: String,
      required: [true, 'Version number is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Version description is required'],
      trim: true,
    },
    changeNotes: {
      type: String,
      default: '',
      trim: true,
    },
    apiSchema: {
      type: String,
      required: [true, 'API schema is required'],
    },
    implementationCode: {
      type: String,
      required: [true, 'Implementation code is required'],
    },
    functions: {
      type: [McpFunctionSchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create compound index for mcpId and version
McpVersionSchema.index({ mcpId: 1, version: 1 }, { unique: true });

// Create index to find latest version
McpVersionSchema.index({ mcpId: 1, createdAt: -1 });

const McpVersion = mongoose.model<IMcpVersion>('McpVersion', McpVersionSchema);

export default McpVersion; 