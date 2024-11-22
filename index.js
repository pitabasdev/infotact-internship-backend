const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://pitabaspradhan834:pitabasp934@cluster0.p6ocoqf.mongodb.net/internshipdata?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

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
  internshipDuration: String,
  resume: String,
  sourceOfInformation: String,
  linkedinConnection: String,
  instagramConnection: String,
  startDate: Date,
  endDate: Date,
});

const Form = mongoose.model("Form", formSchema);

app.post("/submit-form", upload.single("resume"), async (req, res) => {
  try {
    const formData = req.body;
    if (req.file) {
      formData.resume = req.file.path;
    }

    const currentDate = new Date();
    const durationMap = {
      "1 Month": 1,
      "2 Months": 2,
      "3 Months": 3,
    };

    const monthsToAdd = durationMap[formData.internshipDuration] || 1;
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + monthsToAdd);

    formData.startDate = currentDate;
    formData.endDate = endDate;

    const newForm = new Form(formData);
    const result = await newForm.save();
    res.status(200).json({ message: "Form data saved successfully!", result });
  } catch (err) {
    res.status(500).json({ error: "Error saving form data" });
  }
});

app.get("/get-form-data", async (req, res) => {
  try {
    const formData = await Form.find();
    res.status(200).json(formData);
  } catch (err) {
    res.status(500).json({ error: "Error fetching form data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
