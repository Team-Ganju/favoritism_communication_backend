# セキュリティテストについて

## 環境構築
`tests`フォルダに移動し、以下のコマンドを叩く  
(`tests`フォルダ内でnpmコマンドが使えることを確認しておく)

```
npm run build
```

## Firestoreセキュリティルール、セキュリティテストの書き方

[雛形](../../tests/templates/firestore.test.ts.template)を用意しているので、コピペして使用します。

TDDでセキュリティルールを実装していくために下記手順に従って作業していきます。

---
1. セキュリティテストを先に書く
2. `npm run start:wq/i`でfirebaseエミューレータを起動し、
3. `npm run test <テストファイル名>`を実行する
4. 3でエラーになる場合、Firestoreのセキュリティルールを変更する
5. 1~4を繰り返す
---

1. セキュリティテストを先に書く

[雛形](../../tests/templates/firestore.test.ts.template)の`// 以降にテストを記載`のコメントアウトからテストケースを書いていく。

[サンプルコード](../../tests/example/)を用意しているので参考にしてください。

`describe`を使うとテストをグルーピングすることができます。  
`describe`の中に`test`をいくつか書いていきます。

```
describe("スキーマの検証", () => {
    test("正しくないスキーマの場合は作成できない", async () => {
        // taroで認証を持つDBの作成
        const db = createAuthApp({ uid: "taro" });

        // taroでusersコレクションへの参照を取得
        const userDocumentRef = db.collection("users").doc("taro");

        // 想定外のプロパティがある場合
        await firebase.assertFails(
            userDocumentRef.set({ ...correctUserData, place: "japan" })
        );

        // プロパティの型が異なる場合
        await firebase.assertFails(
            userDocumentRef.set({ ...correctUserData, name: 1234 })
        );

        await firebase.assertFails(
            userDocumentRef.set({ ...correctUserData, gender: true })
        );

        await firebase.assertFails(
            userDocumentRef.set({ ...correctUserData, age: "1" })
        );
    });
    ....
});
```
上記はスキーマ検証の一例です。  
失敗ケース`firebase.assertFails()`または成功ケース`firebase.assertSucceeds()`を書くようにします。

2. `npm run start:wq/i`でfirebaseエミューレータを起動し、
3. `npm run test <テストファイル名>`を実行する

4. 3でエラーになる場合、Firestoreのセキュリティルールを変更する

スキーマ検証と値のバリデーションはコレクション毎に作成する必要があると思うので、  
実装済みのセキュリティルールを参考にしながら実装すると良いでしょう。  
また[参考記事](https://qiita.com/ryo2132/items/02b4d341fb01f04ec0be)を参考にしながら実装してもOKです

5. 1~4を繰り返す

## 参考
- [テスト駆動で学ぶ Firestoreセキュリティルール の書き方（認証、スキーマ検証、バリデーション）](https://qiita.com/ryo2132/items/02b4d341fb01f04ec0be)