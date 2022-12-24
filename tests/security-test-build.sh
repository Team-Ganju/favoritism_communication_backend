#!/bin/sh

# asdfでyarnを使えるようにする
corepack enable
asdf reshim nodejs

# yarnのバージョンを確認
yarn -v