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

    const correctUserData = {
        name: "suzuki taro",
        gender: "male",
        age: 30
    };

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

        test("正しくないスキーマの場合は編集できない", async () => {
            // 事前にadmin権限で別ユーザのデータを取得
            createAdminApp()
                .collection("users")
                .doc("taro")
                .set(correctUserData);

            // taroで認証を持つDBの作成
            const db = createAuthApp({ uid: "taro" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 想定外のプロパティがある場合
            await firebase.assertFails(userDocumentRef.update({ place: "japan" }));

            // プロパティが異なる場合
            await firebase.assertFails(userDocumentRef.update({ name: 1234 }));
            await firebase.assertFails(userDocumentRef.set({ gender: true }));
            await firebase.assertFails(userDocumentRef.set({ age: "1" }));
        });
    });
});



