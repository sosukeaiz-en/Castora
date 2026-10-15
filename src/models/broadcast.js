
const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },

    status: {
      type: String,
      enum: [
        'draft',
        'scheduled',
        'live',
        'ended',
        'cancelled'
      ],
      default: 'draft'
    },

    scheduledAt: {
      type: Date,
      default: null
    },

    startedAt: {
      type: Date,
      default: null
    },

    endedAt: {
      type: Date,
      default: null
    },

    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'private'
    },

    thumbnailUrl: {
      type: String,
      default: null
    },

    recording: {
      url: {
        type: String,
        default: null
      },
      durationSeconds: {
        type: Number,
        default: null
      },
      status: {
        type: String,
        enum: ['none', 'processing', 'ready', 'failed'],
        default: 'none'
      }
    },

    destinations: [{
      platform: {
        type: String,
        enum: ['youtube', 'facebook', 'twitch', 'custom']
      },
      status: {
        type: String,
        enum: ['pending', 'connected', 'failed'],
        default: 'pending'
      }
    }]
  },
  { timestamps: true }
);

broadcastSchema.index({ studio: 1, status: 1 });
broadcastSchema.index({ host: 1, createdAt: -1 });
broadcastSchema.index({ scheduledAt: 1 });

module.exports = mongoose.model('Broadcast', broadcastSchema);
