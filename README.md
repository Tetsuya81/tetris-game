# SmartTetris

モバイルブラウザに最適化されたシンプルなテトリスゲーム。モダンなHTMLとCSS、JavaScriptを使用しています。

## 特徴

- モバイルフレンドリーなタッチインターフェース
- レスポンシブデザイン
- 標準的なテトリスのゲームプレイ：
  - 7種類の標準テトリミノ
  - レベル進行による落下速度変更
  - スコアシステム
  - ホールド機能
  - 次のピースプレビュー
  - ソフトドロップとハードドロップ

## 操作方法

- **左/右ボタン**: テトリミノを左右に移動
- **下ボタン**: ソフトドロップ（タップ）、ハードドロップ（長押し）
- **↺/↻ボタン**: テトリミノを反時計回り/時計回りに回転
- **2本指タップ**: テトリミノをホールド
- **START/PAUSE**: ゲームを開始または一時停止
- **RESTART**: ゲームをリセット

## 実行方法

### 必要環境
- Node.js (v12.0.0以上を推奨)
- モダンなWebブラウザ (Chrome, Firefox, Safari, Edgeなど)

### インストールと起動手順
1. リポジトリをクローンするか、ファイルをダウンロードします
   ```
   git clone https://github.com/yourusername/smart-tetris.git
   cd smart-tetris
   ```

2. 以下のコマンドでサーバーを起動します：
   ```
   node server.js
   ```
   
   バックグラウンドで実行する場合は以下のコマンドが使えます：
   ```
   node server.js &
   ```
   
   特定のポートでサーバーを実行したい場合は、`server.js`ファイル内の`PORT`変数を変更します。

    *PM2で起動する場合(echosystem.config.jsを使って)*
    ```
    pm2 init
    ```

    ecosystem.config.js
    ```
    module.exports = {
      apps: [{
        name: "smarttetris",
        script: "server.js",
        watch: true,
        env: {
          NODE_ENV: "development",
          PORT: 3000
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 9999
        },
        instances: 1,
        exec_mode: "fork",
        autorestart: true,
        max_memory_restart: "200M"
      }]
    };

    ```
    pm2 start ecosystem.config.js
    ````


3. ブラウザで http://0.0.0.0:9999/ にアクセスします

4. モバイルデバイスでアクセスする場合は、同じWi-Fiネットワーク内のコンピュータのIPアドレスを使用します
   ```
   http://あなたのPCのIPアドレス:9999/
   ```
   
   IPアドレスは以下のコマンドで確認できます：
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` または `ip addr`

### トラブルシューティング

- **ポート9999が既に使用されている場合**
  サーバー起動時に「Error: listen EADDRINUSE: address already in use 0.0.0.0:9999」のようなエラーが表示された場合、そのポートは既に使用されています。`server.js`内の`PORT`変数を別の番号（例: 8080, 3000など）に変更してください。

- **「Cannot GET /」エラーが表示される場合**
  ファイルパスが正しいか確認してください。全てのファイル（index.html, styles.css, script.js）が正しいディレクトリに配置されているか確認してください。

- **ゲームコントロールが機能しない場合**
  ブラウザをリロードしてみてください。また、最新のブラウザを使用していることを確認してください。

- **モバイルデバイスからアクセスできない場合**
  - ホストマシンとモバイルデバイスが同じネットワークに接続されていることを確認してください
  - ファイアウォール設定を確認し、必要に応じてポート9999を許可してください
  - ホストのIPアドレスが正しいか確認してください

## 技術スタック

- HTML5
- CSS3（Flexbox、Grid、レスポンシブデザイン）
- JavaScript（ES6+）
- NodeJS（サーバー実行用）

## レベルとスコアシステム

- **レベル進行**: 10行消去するごとにレベルアップ（最大レベル20）
- **落下速度**: レベルが上がるごとに落下速度が10%速くなる
- **スコア計算**:
  - 1行消去: 100 × 現在のレベル
  - 2行消去: 300 × 現在のレベル
  - 3行消去: 500 × 現在のレベル
  - 4行消去: 800 × 現在のレベル

## ライセンス

MIT
