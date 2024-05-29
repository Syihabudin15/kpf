"use client";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { TablePdfBodies, TablePdfHeaders } from "./TablePdf";

export function TableAngsuran({
  dataHeader,
  dataBodies,
}: {
  dataHeader: TablePdfHeaders[];
  dataBodies: TablePdfBodies[];
}) {
  const style = StyleSheet.create({
    headerWrap: {
      fontWeight: "bold",
      display: "flex",
      flexDirection: "row",
      fontSize: 8,
    },
    headerValue: {
      width: `${100 / Object.keys(dataHeader).length}%`,
      padding: 3,
      border: "1px solid #aaa",
    },
    bodyWrap: {
      display: "flex",
      flexDirection: "row",
      fontSize: 8,
    },
  });
  return (
    <View style={{ margin: "5px", border: "1px solid #aaa" }}>
      <View style={style.headerWrap} fixed>
        {dataHeader.map((head, ind) => (
          <Text
            key={ind}
            style={{
              ...style.headerValue,
              ...head.style,
            }}
          >
            {head.title}
          </Text>
        ))}
      </View>
      <View>
        {dataBodies.map((body, ind) => (
          <View key={body.key || ind} style={style.bodyWrap}>
            {dataHeader.map((head, index) => (
              <Text
                key={index}
                style={{
                  width: `${100 / Object.keys(dataHeader).length}%`,
                  padding: 3,
                  ...body.style,
                  ...head.style,
                }}
              >
                {body[head.dataIndex]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
