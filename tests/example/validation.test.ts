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

    describe("値のバリデーション", () => {
        test("nameは1文字以上30文字以内である", async () => {
            // taroで認証を持つDBの作成
            const db = createAuthApp({ uid: "taro" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 正しい値ではデータを作成できる
            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, name: "a".repeat(30) })
            );

            // 正しくない値ではデータを作成できない
            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, name: "" })
            );

            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, name: "a".repeat(31) })
            );
        });

        test("`gender`は`male`,`female`,`genderDiverse`の3種類だけが選べる", async () => {
            // taroでuser認証を持つDBの作成
            const db = createAuthApp({ uid: "taro" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 正しい値ではデータを作成できる
            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, gender: "male" })
            );

            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, gender: "female" })
            );

            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, gender: "genderDiverse" })
            );

            // 正しくない値ではデータを作成できない
            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, gender: "" })
            );

            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, gender: "男性" })
            );
        });

        test("`age`は0~150の数値である", async () => {
            // taroで認証を持つDBの作成
            const db = createAuthApp({ uid: "taro" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 正しい値ではデータを作成できる
            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, age: 0 })
            );

            await firebase.assertSucceeds(
                userDocumentRef.set({ ...correctUserData, age: 150 })
            );

            // 正しくない値ではデータを作成できない
            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, age: -1 })
            );

            await firebase.assertFails(
                userDocumentRef.set({ ...correctUserData, age: 151 })
            );
        });
    });
});