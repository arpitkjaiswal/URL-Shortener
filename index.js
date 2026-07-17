const express = require("express");

const connectToDatabase = require("./connect");
const urlRoutes = require("./routes/url");
const Url = require("./models/url");
//it is a function that generates a short URL for a given redirect URL. 
// It uses the nanoid library to generate a unique short ID, which is then s
// tored in a MongoDB database along with the redirect URL and an empty visit history. 
// The function returns the generated short ID in the response.


const app = express();
const PORT = 8000;


// Middleware
app.use(express.json());




connectToDatabase("mongodb://127.0.0.1:27017/short-url")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});

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
            { new: true }
        );

        if (!urlEntry) {
            return res.status(404).json({
                error: "URL not found",
            });
        }

        return res.redirect(urlEntry.redirectUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




