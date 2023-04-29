import { openDB } from "idb";

const DB_NAME = `SolCerberusDB`;
const APP_STORE = "SolCerberusStore";
const getDB = async () => {
  return await openDB(
    DB_NAME,
    parseInt(process.env.NEXT_PUBLIC_DB_VERSION as string),
    {
      upgrade(db, oldVersion, newVersion, transaction) {
        // APPs
        var appStore = db.createObjectStore(APP_STORE, {
          keyPath: "id",
        });
        appStore.createIndex("id", "id", { unique: true });
        appStore.createIndex("authority", "authority", { unique: false });
        appStore.createIndex("recovery", "recovery", { unique: false });
        appStore.createIndex("name", "name", { unique: false });
        appStore.createIndex("bump", "bump", { unique: false });
      },
    }
  );
};

export const get_cached_app = async (id: number) => {
  const db = await getDB();
  return await db.get(APP_STORE, id);
};
export const del_cached_app = async (id: number) => {
  const db = await getDB();
  await db.delete(APP_STORE, id);
};
export const put_cached_app = async (app: any) => {
  const db = await getDB();
  await db.put(APP_STORE, app);
};

export default getDB;
