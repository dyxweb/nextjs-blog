const fs = require('fs');
const path = require('path');

// 获取文件目录数据
export async function getFileCatalog(dir: string) {
  const catalogData = [];
  const dirs = fs.readdirSync(path.join(process.cwd(), dir));
  dirs.forEach((dirItem: string, dirIndex: number) => {
    catalogData.push({
      title: dirItem,
      key: dirItem,
      children: [],
    })
    const currentDirPath = `${dir}/${dirItem}`;
    const stats = fs.statSync(path.join(process.cwd(), currentDirPath));
    if (stats.isDirectory()) {
      const files = fs.readdirSync(path.join(process.cwd(), currentDirPath));
      files.forEach((fileItem: string) => {
        const fileName = fileItem.split('.')[0];
        catalogData[dirIndex].children.push({
          title: fileName,
          key: fileName,
        })
      })
    }
  })
  return catalogData;
}

// 获取文件内容
export async function getFileContent(file: string) {
  const fileContent = fs.readFileSync(path.join(process.cwd(), file), { encoding:'utf8' });
  return fileContent;
}