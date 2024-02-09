import express from "express";
import cors from "cors";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { adminRouter } from "./routes/AdminRoute.js";
import { employeeRouter } from "./routes/EmployeeRoute.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser())
app.use("/auth", adminRouter);
app.use("/employee", employeeRouter);
app.use(express.static("Public"));

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "Not authenticated" });
  }
};
app.get('/verify',verifyUser, (req, res)=> {
  return res.json({Status: true, role: req.role, id: req.id})
} )

app.listen(3000, () => {
  console.log("server is running");
});