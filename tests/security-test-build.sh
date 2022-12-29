#!/bin/sh

# asdfでyarnを使えるようにする
corepack enable
asdf reshim nodejs

# npm install(npm iも同じ)でjestをインストール
npm i

# yarnのバージョンを確認
yarn -v