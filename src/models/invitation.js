
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true
    },

    broadcast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broadcast',
      required: true
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    guestName: {
      type: String,
      trim: true,
      default: ''
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired', 'revoked'],
      default: 'pending'
    },

    tokenHash: {
      type: String,
      required: true,
      select: false
    },

    expiresAt: {
      type: Date,
      required: true
    },

    acceptedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

invitationSchema.index({ broadcast: 1, guestEmail: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invitation', invitationSchema);
