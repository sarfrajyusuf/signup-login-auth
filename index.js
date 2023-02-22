require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ErrorHandler = require("./middleware/errorHandler");
const user_router = require("./routes/routes");
const db = require("./db/config");
const cors = require("cors");
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use(bodyParser.json())
app.use(user_router)
app.use(ErrorHandler)

app.get("/home", (req, res) => {
  res.json({ msg: "CORS-enabled for all origins!" });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
