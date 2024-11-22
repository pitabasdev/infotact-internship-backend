const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  },
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose
  .connect("mongodb+srv://pitabaspradhan834:pitabasp934@cluster0.p6ocoqf.mongodb.net/internshipdata?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define Schema for form data
const formSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  gender: String,
  qualification: String,
  currentYear: String,
  collegeUniversity: String,
  contactNumber: String,
  whatsappNumber: String,
  skillLevel: String,
  internshipProgram: String,
  resume: String, // Store resume filename or URL
  sourceOfInformation: String,
  linkedinConnection: String,
  instagramConnection: String,
});

const Form = mongoose.model("Form", formSchema);

// API to handle form data submission with file upload
app.post("/submit-form", upload.single("resume"), async (req, res) => {
  try {
    const formData = req.body;

    // If file is uploaded, update the resume field
    if (req.file) {
      formData.resume = req.file.path; // Save file path in the database
    }

    // Create a new document in MongoDB
    const newForm = new Form(formData);
    await newForm.save();

    res.status(200).json({ message: "Form data saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error saving form data" });
    console.error(err);
  }
});
app.get("/get-form-data", async (req, res) => {
  try {
    // Fetch all documents from the Form collection
    const formData = await Form.find();

    res.status(200).json(formData); // Send the data as JSON response
  } catch (err) {
    res.status(500).json({ error: "Error fetching form data" });
    console.error(err);
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
