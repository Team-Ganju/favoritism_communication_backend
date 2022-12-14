// describe("サンプル", () => {
//     test("サンプルテスト", async () => {
//         expect(1 + 2).toBe(3);
//     });
// });

import * as firebase from "@firebase/testing";
import * as fs from 'fs';

const PROJECT_ID = "favoritismcommunication-1d285";
const RULES_PATH = "../firestore.rules";

// 認証つきのFirestore appを作成する
const createAuthApp = (auth?: object): firebase.firestore.Firestore => {
    return firebase
        .initializeTestApp({ projectId: PROJECT_ID, auth: auth })
        .firestore();
};

// 管理者権限で操作できるFirestore appを作成する
const createAdminApp = (): firebase.firestore.Firestore => {
    return firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
};

// user情報への参照を作る
const userRef = (db: firebase.firestore.Firestore) => db.collection("user");

describe("Firestoreセキュリティルール", () => {
    // ルールファイルの読み込み
    beforeAll(async () => {
        await firebase.loadFirestoreRules({
            projectId: PROJECT_ID,
            rules: fs.readFileSync(RULES_PATH, "utf8")
        })
    });

    // Firestoreのデータのクリーンアップ
    afterEach(async () => {
        await firebase.clearFirestoreData({ projectId: PROJECT_ID });
    });

    // Firestoreアプリの削除
    afterAll(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()));
    });

    // 以降にテストを記載
    test("認証がなくとも読み書きが可能", async () => {
        const db = createAuthApp();
        const user = userRef(db).doc("test");
        await firebase.assertSucceeds(user.set({ name: "太郎" }));
        await firebase.assertSucceeds(user.get());
    });
});