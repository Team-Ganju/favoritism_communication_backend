# favoritism_communication_backend
## 偏愛コミュニケーションアプリのバックエンド

## 環境構築

- 後で詳しく書く

- スクリプトを用意したのでプロジェクトルートで実行してください

```
./scripts/build.sh
```

## Firebase Emulator起動（Flutterアプリと連携）

- firebase emulatorをビルドしてブラウザでコンソールを確認します。

```
npm run start
```

ブラウザで`http://127.0.0.1:4000`にアクセスします。

スクショのような画面が表示できればOK
<img src="https://user-images.githubusercontent.com/25321380/204584975-9f98b913-2987-4af6-9cf9-b7d0534f25d6.png" width=800>

## JIRAのタスク

- [JIRAのタスク](https://joint-dev.atlassian.net/browse/FC-107)

## 参考記事
- [CloudFirestoreの場所](https://firebase.google.com/docs/firestore/locations)
- [FirebaseCLIリファレンス](https://firebase.google.com/docs/cli#windows-npm)
- [Local Emulator Suiteをインストール、構成、統合する](https://firebase.google.com/docs/emulator-suite/install_and_configure?authuser=0)
- [Firestoreのコストリスク削減](https://rinoguchi.net/2020/08/firestore-cost-risk.html)
- [Firebaseのプロジェクトを作り直すことになったたった一つの設定項目](https://qiita.com/qrusadorz/items/99432fac6cbc93ebaff2)
- [PaPaPointアプリ【環境構築編②】](https://bellbellbell.info/2020/10/papapoint-environment-firebase/)
- [Node.js ランタイム](https://cloud.google.com/functions/docs/concepts/nodejs-runtime#console)
- [Firestore Emulatorで8080ポートが起動できない時](https://qiita.com/HisakoIsaka/items/03ed541438572a3cc6e7)
