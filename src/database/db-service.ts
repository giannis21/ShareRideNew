import { useEffect, useRef } from "react";
import { SQLiteDatabase, openDatabase, enablePromise } from "react-native-sqlite-storage";
export const FAVORITE_SEARCH_SCHEMA = 'FavSearch'
export const FAVORITE_TABLE = 'favorite_table'

type FavItem = {
    startcoord: string,
    startplace: string,
    endcoord: string,
    endplace: string,
    compoundKey: string
};

export const getDBConnection = async () => {
    return openDatabase({ name: FAVORITE_SEARCH_SCHEMA, location: 'default' });
};
enablePromise(true);
export const createTable = async (db: SQLiteDatabase) => {
    // create table if not exists
    const query = `CREATE TABLE IF NOT EXISTS ${FAVORITE_TABLE}(compoundKey VARCHAR(100) PRIMARY KEY , startcoord VARCHAR(100), startplace VARCHAR(100), endcoord VARCHAR(255), endplace VARCHAR(255),isSelected INTEGER, email VARCHAR(255))`;
    db.transaction((tx) => {
        tx.executeSql(query)

    });
    // await db.executeSql(query);
};

export const getFavorites = async (email: string, db: SQLiteDatabase): Promise<FavItem[]> => {
    try {
        const favItems: FavItem[] = [];
        const results = await db.executeSql(`SELECT * FROM ${FAVORITE_TABLE} where email=?`, [email]);
        results.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
                favItems.push(result.rows.item(index))
            }
        });
        return favItems.reverse();
    } catch (error) {
        console.error(error);
        throw Error('Failed to get favItems !!!');
    }
};

export const deleteRoute = async (compoundKey: string, db: SQLiteDatabase) => {
    try {

        db.transaction((tx) => {
            tx.executeSql(
                `DELETE FROM  ${FAVORITE_TABLE} where compoundKey=?`,
                [compoundKey],
                (tx, results) => {

                }
            );
        });


    } catch (error) {
        console.error(error);
        throw Error('Failed to get favItems !!!');
    }
};

export const insertRoute = async (route: JSON, db: SQLiteDatabase) => {
    try {
        db.transaction(function (tx) {
            tx.executeSql(
                `INSERT INTO ${FAVORITE_TABLE} (compoundKey, startcoord, startplace,endcoord,endplace,isSelected,email) VALUES (?,?,?,?,?,?,?)`,
                [route.compoundKey, route.startcoord, route.startplace, route.endcoord, route.endplace, 0, route.email],
                (tx, results) => {

                }
            );
        });


    } catch (error) {
        console.error(error);
        throw Error('Failed to get favItems !!!');
    }
};