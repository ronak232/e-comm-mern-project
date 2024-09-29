import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

// instance of express method
const app = express();

const __dirname = path.resolve();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", routes);

app.use(
  "/static/images",
  express.static(path.join(__dirname, "public/images"))
);

app.listen(process.env.LOCAL_PORT || 8001, () => {
  console.log("listening on 8001 success");
});
