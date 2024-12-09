const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const LogInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Normalize email to lowercase
        trim: true // Remove leading/trailing whitespace
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
LogInSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            console.log('Password hashed successfully');
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Method to compare hashed password
LogInSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', LogInSchema);
