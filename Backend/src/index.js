import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: true}));


import geneRoutes from "./routes/geneRoutes.js";
app.use("/api/gene", geneRoutes);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});