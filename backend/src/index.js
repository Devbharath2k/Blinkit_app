import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import HandlerDatabase from "./Config/db.js";
import router from "./Router/route.js";


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan())

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4000'] ,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'] 
}))

app.get("/", (req, res) => {
    res.send("welcome to the devbharath myapp Blinkit")
})
app.use(router)

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.CLIENT_URL}`);
    HandlerDatabase();
})


