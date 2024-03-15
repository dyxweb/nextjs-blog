const fs = require('fs');
const path = require('path');

// 获取文件目录数据
export async function getFileData(dir: string) {
  const fileData = [];
  const dirs = fs.readdirSync(path.join(process.cwd(), dir));
  dirs.forEach((dirItem: string, dirIndex: number) => {
    fileData.push({
      title: dirItem,
      key: dirItem,
      children: [],
    })
    const currentDirPath = `${dir}/${dirItem}`;
    const stats = fs.statSync(path.join(process.cwd(), currentDirPath));
    if (stats.isDirectory()) {
      const files = fs.readdirSync(path.join(process.cwd(), currentDirPath));
      files.forEach((fileItem: string) => {
        fileData[dirIndex].children.push({
          title: fileItem,
          key: fileItem,
        })
      })
    }
  })
  return fileData;
}