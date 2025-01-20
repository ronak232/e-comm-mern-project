import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { initSocket } from "./services/socket/socket.js";
import blogRoutes from "./routes/blogpost.routes.js";

// instance of express method
const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", routes);
app.use("/", blogRoutes);

app.use(
  "/static/images",
  express.static(path.join(__dirname, "/public/images"))
);

const socketServer = server.listen(process.env.LOCAL_PORT || 8000, () => {
  console.log("listening on 8000 success");
});

initSocket(socketServer);
