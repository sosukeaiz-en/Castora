
const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null
        },

        description: {
            type: String,
            default: ''
        },

        settings: {
            resolution: {
                type: String,
                enum: ['720p', '1080p', '4K'],
                default: '720p'
            },

            layout: {
                type: String,
                enum: ['grid', 'speaker', 'presentation'],
                default: 'grid'
            },

            isReusable: {
                type: Boolean,
                default: false
            }
        },

        branding: {
            logoUrl: {
                type: String,
                default: ''
            },

            backgroundUrl: {
                type: String,
                default: ''
            },

            overlayUrl: {
                type: String,
                default: ''
            }
        },

        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
