"use client";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

interface TablePdfProp {
  title: string;
  style?: object;
  dataIndex: string;
}
export interface TablePdfHeaders extends TablePdfProp {
  child?: TablePdfProp[];
}
export interface TablePdfBodies {
  key?: string | number;
  style?: object;
  [key: string]: any;
}

export function TablePdf({
  dataHeader,
  dataBodies,
}: {
  dataHeader: TablePdfHeaders[];
  dataBodies: TablePdfBodies[];
}) {
  const style = StyleSheet.create({
    headerWrap: {
      display: "flex",
      flexDirection: "row",
      fontWeight: "bold",
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
    <View style={{ margin: "5px" }}>
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
                style={{ ...style.headerValue, ...body.style, ...head.style }}
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
