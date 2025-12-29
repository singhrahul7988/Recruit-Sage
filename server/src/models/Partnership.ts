import mongoose, { Document, Schema } from 'mongoose';

export interface IPartnership extends Document {
  requesterId: mongoose.Types.ObjectId; // Who sent the request
  recipientId: mongoose.Types.ObjectId; // Who received it
  status: 'Pending' | 'Active' | 'Rejected';
  pairKey: string;
  createdAt: Date;
}

const PartnershipSchema: Schema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Active', 'Rejected'], 
      default: 'Pending' 
    },
    pairKey: { type: String },
  },
  { timestamps: true }
);

PartnershipSchema.pre('validate', function () {
  const doc = this as any;
  if (!doc.pairKey && doc.requesterId && doc.recipientId) {
    const ids = [String(doc.requesterId), String(doc.recipientId)].sort();
    doc.pairKey = ids.join(':');
  }
});

// Prevent duplicate requests between the same two users (both directions)
PartnershipSchema.index(
  { pairKey: 1 },
  { unique: true, partialFilterExpression: { pairKey: { $exists: true } } }
);

const Partnership = mongoose.model<IPartnership>('Partnership', PartnershipSchema);
export default Partnership;
