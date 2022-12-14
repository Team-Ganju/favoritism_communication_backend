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

    describe("ユーザ認証情報の検証", () => {
        test("自分のuidと同様のドキュメントIDのユーザ情報だけを閲覧、作成、編集、削除可能", async () => {
            // taroで認証を持つDBの作成
            const db = createAuthApp({ uid: "taro" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 自分のuidと同様のドキュメントIDのユーザ情報を追加可能
            await firebase.assertSucceeds(userDocumentRef.set(correctUserData));

            // 自分のuidと同様のドキュメントIDのユーザ情報を閲覧可能
            await firebase.assertSucceeds(userDocumentRef.get());

            // 自分のuidと同様のドキュメントIDのユーザ情報を編集可能
            await firebase.assertSucceeds(
                userDocumentRef.update({ name: "SUZUKI TARO" })
            );

            // 自分のuidと同様のドキュメントIDのユーザ情報を削除可能
            await firebase.assertSucceeds(userDocumentRef.delete());
        });

        test("自分のuidと異なるドキュメントは閲覧、作成、編集、削除ができない", async () => {
            // 事前にadmin権限で別ユーザのデータ準備
            createAdminApp()
                .collection("users")
                .doc("taro")
                .set(correctUserData);

            // hanakoで認証を持つDBの作成
            const db = createAuthApp({ uid: "hanako" });

            // taroでusersコレクションへの参照を取得
            const userDocumentRef = db.collection("users").doc("taro");

            // 自分のuidと異なるドキュメントIDのユーザ情報を追加不可
            await firebase.assertFails(userDocumentRef.set(correctUserData));

            // 自分のuidと異なるドキュメントIDのユーザ情報を閲覧不可
            await firebase.assertFails(userDocumentRef.get());

            // 自分のuidと異なるドキュメントIDのユーザ情報を編集不可
            await firebase.assertFails(
                userDocumentRef.update({ name: "SUZUKI TARO" })
            );

            // 自分のuidと異なるドキュメントIDのユーザ情報を削除不可
            await firebase.assertFails(userDocumentRef.delete());
        });
    });
});