// CGPT4に書かせた
const fs = require('fs');
const path = require('path');

const projectRoot = './source'; // ここをプロジェクトのルートディレクトリに合わせて調整
const outputFile = './source/index.js'; // インデックスファイルのパス

function isJavaScriptFile(file) {
  return file.endsWith('.js');
}

function generateImportPath(file, root) {
  const relativePath = path.relative(root, file);
  return `./${relativePath.replace(/\\/g, '/')}`; // Windowsのパス区切り文字を正規化
}

function generateIndexFile(rootDir, output) {
  const files = [];

  function findJavaScriptFiles(directory) {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        findJavaScriptFiles(path.join(directory, item.name));
      } else if (isJavaScriptFile(item.name)) {
        files.push(path.join(directory, item.name));
      }
    }
  }

  findJavaScriptFiles(rootDir);

  const imports = files.map(file => {
    const importPath = generateImportPath(file, rootDir);
    return `export * from '${importPath}';`;
  });

  fs.writeFileSync(output, imports.join('\n'), 'utf8');
  console.log(`Index file generated at ${output}`);
}

generateIndexFile(projectRoot, outputFile);

