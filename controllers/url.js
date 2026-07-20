


const { nanoid } = require("nanoid");
const Url = require("../models/url");

async function handleGenerateShortUrl(req, res) {
    try {
        console.log("BODY:", req.body);

        const { redirectUrl } = req.body;

        if (!redirectUrl) {
            return res.status(400).json({
                error: "redirectUrl is required",
            });
        }

        const shortId = nanoid(8);

        const created = await Url.create({
            shortId,
            redirectUrl,
            visitHistory: [],
        });

        console.log("Created:", created);

        return res.status(201).json({
            shortId,
        });

    } catch (err) {
        console.error("========== ERROR ==========");
        console.error(err);
        console.error("===========================");

        return res.status(500).json({
            error: err.message,
        });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;

        const result = await Url.findOne({ shortId });

        if (!result) {
            return res.status(404).json({
                error: "Short URL not found",
            });
        }

        return res.json({
            totalclicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    handleGenerateShortUrl,
    handleGetAnalytics,
};
