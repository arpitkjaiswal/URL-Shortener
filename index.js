

onst express = require("express");
const connectToDatabase = require("./connect");
const urlRoutes = require("./routes/url");
const Url = require("./models/url");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.static("public"));

connectToDatabase("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/url", urlRoutes);

app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const urlEntry = await Url.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: new Date(),
          },
        },
      },
      { returnDocument: "after" } // updated option
    );

    if (!urlEntry) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.redirect(urlEntry.redirectUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
