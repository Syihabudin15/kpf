import { StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "Times-Bold", fontStyle: "normal", fontWeight: "bold" },
    { src: "Times-Roman", fontStyle: "normal", fontWeight: "normal" },
    { src: "Times-Italic", fontStyle: "italic", fontWeight: "normal" },
    { src: "Times-Bold-Italic", fontStyle: "italic", fontWeight: "bold" },
  ],
});
Font.register({
  family: "SourceSansPro",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf",
    }, // font-style: normal, font-weight: normal
    {
      src: "https://fonts.gstatic.com/s/sourcesanspro/v14/6xKydSBYKcSV-LCoeQqfX1RYOo3i54rAkA.ttf",
      fontWeight: 600,
    },
  ],
});
export const stylePdf = StyleSheet.create({
  rootFont: {
    fontFamily: "SourceSansPro",
    fontSize: 8,
  },
  root: {
    fontFamily: "SourceSansPro",
    fontSize: 8,
    padding: 30,
    lineHeight: 1,
  },
  analisaFlex: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    padding: "2px 10px",
  },
});
