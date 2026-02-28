import express from "express";
import "dotenv/config";
import contactRoutes from "./routes/contact.routes";

const app = express();

app.use(express.json());
app.use("/api", contactRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
