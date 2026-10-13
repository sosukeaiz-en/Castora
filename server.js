require("dotenv").config();
const connectDb = require("./src/config/db");
connectDb();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});