const next = require("next");
const express = require("express");

const port = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use("/category", express.static(__dirname + "/storage/category"));
  server.use("/blog", express.static(__dirname + "/storage/blog"));
  server.use("/mutasi", express.static(__dirname + "/storage/mutasi"));
  server.use("/flagging", express.static(__dirname + "/storage/flagging"));
  server.use("/akad", express.static(__dirname + "/storage/akad"));
  server.use("/slik", express.static(__dirname + "/storage/slik"));
  server.use("/pengajuan", express.static(__dirname + "/storage/pengajuan"));
  server.use("/wawancara", express.static(__dirname + "/storage/wawancara"));
  server.use("/asuransi", express.static(__dirname + "/storage/asuransi"));

  server.all("*", (req, res) => {
    return handle(req, res);
  });
  try {
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
});
