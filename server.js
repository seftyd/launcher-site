const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("YouTube Proxy is running");
});

app.get("/watch", async (req, res) => {
  const id = req.query.v;
  if (!id) return res.status(400).send("Missing video ID");

  try {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, { quality: "18" });
    res.redirect(format.url);
  } catch (e) {
    res.status(500).send("Error loading video");
  }
});

app.listen(3000);
