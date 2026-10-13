
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
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

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },

                role: {
                    type: String,
                    enum: ['admin', 'member'],
                    default: 'member'
                },

                joinedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

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

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
