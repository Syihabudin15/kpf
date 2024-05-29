const next = require("next");
const express = require("express");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use("/akad", express.static(__dirname + "/storage/akad"));
  server.use("/asuransi", express.static(__dirname + "/storage/asuransi"));
  server.use("/cair", express.static(__dirname + "/storage/cair"));
  server.use("/lainnya", express.static(__dirname + "/storage/lainnya"));
  server.use("/pengajuan", express.static(__dirname + "/storage/pengajuan"));
  server.use("/profile", express.static(__dirname + "/storage/profile"));
  server.use("/si", express.static(__dirname + "/storage/si"));
  server.use("/slik", express.static(__dirname + "/storage/slik"));
  server.use("/wawancara", express.static(__dirname + "/storage/wawancara"));
  server.use("/bank_logo", express.static(__dirname + "/storage/bank_logo"));
  server.use(
    "/surat_berkas",
    express.static(__dirname + "/storage/surat_berkas")
  );
  server.use("/pelunasan", express.static(__dirname + "/storage/pelunasan"));
  server.use("/jaminan", express.static(__dirname + "/storage/jaminan"));
  server.use("/rekening", express.static(__dirname + "/storage/rekening"));
  server.use("/mutasi", express.static(__dirname + "/storage/mutasi"));
  server.use("/flagging", express.static(__dirname + "/storage/flagging"));
  server.use("/video_cair", express.static(__dirname + "/storage/video_cair"));
  server.use(
    "/video_cair2",
    express.static(__dirname + "/storage/video_cair2")
  );
  server.use(
    "/video_cair3",
    express.static(__dirname + "/storage/video_cair3")
  );
  server.use(
    "/bukti_transfer",
    express.static(__dirname + "/storage/bukti_transfer")
  );
  server.use("/epotpen", express.static(__dirname + "/storage/epotpen"));

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
