const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: "application/json" }));
app.use(cors());
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

app.use(async (req, res, next) => {
    const count = fs.readFileSync("./count.txt", {
        encoding: "utf-8",
    });
    fs.writeFileSync("./count.txt", `${Number(count) + 1}`);
    next();
});

// Routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/paymentRouter"));

app.get("/api/count-visits", (req, res) => {
    const count = fs.readFileSync("./count.txt", {
        encoding: "utf-8",
    });

    return res.json({ count: count });
});

//connect mongoose DB
const URI = process.env.MONGODB_URL;
mongoose.connect(
    URI,
    {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("Kết nối thành công Database Monggo");
    }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server đang chạy trên cổng", PORT);
});
