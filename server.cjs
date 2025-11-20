const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


const app = express();
const PORT = 3000;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Local Vite dev server
  "https://<your-frontend-on-render>.onrender.com", // IMPORTANT: Replace with your actual Render frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://db_user_01:huRWTPn9rtfZFDZy@jib.bjdsdg3.mongodb.net/pos?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRoutes = require("./routes/auth.cjs");
app.use("/api/auth", authRoutes);

const recipeRoutes = require("./routes/recipes.cjs");
app.use("/api/recipes", recipeRoutes);

const tagsRoute = require("./routes/tag.cjs");
app.use("/api/tag", tagsRoute);

const reportsRoute = require("./routes/reports.cjs");
app.use("/api/reports", reportsRoute);

const commentsRoute = require("./routes/comments.cjs");
app.use("/api/comments", commentsRoute);

const imagesRoute = require("./routes/images.cjs");
app.use("/api/images", imagesRoute);

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected");


  // ✅ เพิ่มข้อมูลตัวอย่าง 3รายการ (ถ้าต้องการ)
  //await Item.create({ name: "Banana", price: 50 });
  //await Item.create({ name: "Orange", price: 80 });
  //await Item.create({ name: "Apple", price: 100 });
  //console.log("Sample item inserted");

  // ลบข้อมูลทั้งหมด (ถ้าต้องการ)
  //await Item.deleteMany({});
  //console.log("All items deleted");
});

app.get("/", (req, res) => {
  res.send("Hello from Express backend 🚀");
});


app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
