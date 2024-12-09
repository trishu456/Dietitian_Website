const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/detail', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
})
.catch(err => {
    console.log("MongoDB connection error: ", err);
});

// Define the LogInSchema
const LogInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    }
});

// Create a model for LogInSchema
const User = mongoose.model("User", LogInSchema);

// Define the dietChartSchema
const dietChartSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true
    },
    items: [
        {
            itemName: String,
            value: String,
            recommendedFoods: [String]
        }
    ]
});

// Create a model for dietChartSchema
const DietChart = mongoose.model('DietChart', dietChartSchema);
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    message :String
});

// Create a model for contactSchema
const Contact = mongoose.model('Contact', contactSchema);



// Export  models
module.exports = {
    User,
    DietChart,
    Contact
};
