import { promises as fs } from "fs";
import path from "path";
import moment from "moment";

export function SaveImageLocaly(
  dataString: string,
  dir: string,
  ext: string,
  name: string,
  nopen: string
) {
  const buff = Buffer.from(dataString.split(",")[1], "base64");
  try {
    const fileName = `${nopen}_${name}_${dir}_${moment().format(
      "DDMMYYYY"
    )}.${ext}`;
    const pathUrl = path.join(
      process.cwd(),
      `/storage/${dir.toLocaleLowerCase()}/${fileName}`
    );
    fs.writeFile(pathUrl, buff);
    return `/${dir.toLowerCase()}/${fileName}`;
  } catch (err) {
    console.log(err);
    throw new Error("Server Error");
  }
}
