const http = require('http');
const fs = require('fs');
const path = require('path');

// ポート設定: コマンドライン引数 > 環境変数 > デフォルト値の順で確認
const PORT = process.argv[2] || process.env.PORT || 9999;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // リクエストURLからファイルパスを取得
  let filePath = req.url;
  if (filePath === '/' || filePath === '/index.html') {
    filePath = '/index.html';
  }

  // ファイルの絶対パスを作成
  const fullPath = path.join(__dirname, filePath);

  // ファイル拡張子を取得
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // ファイルを読み込んでレスポンスとして返す
  fs.readFile(fullPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // ファイルが見つからない場合は404を返す
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>The requested file was not found on this server.</p>');
      } else {
        // サーバーエラーの場合は500を返す
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 Internal Server Error</h1><p>${error.code}</p>`);
      }
    } else {
      // 成功した場合はファイルの内容を返す
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
