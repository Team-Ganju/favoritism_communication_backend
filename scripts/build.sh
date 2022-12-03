#!/bin/sh

# asdfでnodeとJDKをインストールします
asdf install

# firebaseコマンドを有効にします
npm install -g firebase-tools

functionsディレクトリに移動してfunctionsをビルドする
ビルドが終わったらプロジェクトルートに戻る
cd functions
npm run build 
cd ..