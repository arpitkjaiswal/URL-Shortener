const { nanoid } = require("nanoid");
const Url = require("../models/url");

async function handleGenerateShortUrl(req, res) {
    try {
        const { redirectUrl } = req.body;

        if (!redirectUrl) {
            return res.status(400).json({
                error: "redirectUrl is required",
            });
        }

        const shortId = nanoid(8);

        await Url.create({
            shortId,
            redirectUrl,
            visitHistory: [],
        });

        return res.status(201).json({
            shortId,
        }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}


async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId });

    return  res.json({
        totalclicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}


module.exports = {
    handleGenerateShortUrl,
    handleGetAnalytics,
};