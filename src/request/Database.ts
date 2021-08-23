import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import jsonData from './import-json'
  
// The shared database instance
let database: SQLiteDBConnection | null = null;

/**
 * initialize database
 */
export const initDatabase = async () => {
// Create & setup a connection object
    const SQLite = new SQLiteConnection(CapacitorSQLite);
    const db = await SQLite.createConnection(
        "MyPantry",
        false,
        "no-encryption",
        1
    );
    // Import schema and default values
    await SQLite.importFromJson(JSON.stringify(jsonData));
    // Open the database
    await db.open();
    // Update the shared instance
    database = db;
};

/**
 * @returns all products in the database
 */
export const QueryGetProducts = async () => {
    if (!!database)
        return await database.query("SELECT * FROM products;")
}

/**
 * Create a new product in the database
 * @param productData //dato da definire
 * @returns 
 */
export const QueryCreateProduct = async (productData: any) => {
    if (!!database) {
        const { id, barcode, name, description, image } = productData;
        return await database.run(
            "INSERT INTO products (id,barcode,name,description,quantity,image) VALUES(?,?,?,?,?,?)",
            [id, barcode, name, description, 1, image]
        );
    }
};

/**
 * Update a, existing product in the database by id
 * @param barcode 
 * @param productData 
 * @returns 
 */
export const QueryUpdateProduct = async (id: any, productData: any) => {
    if (!!database) {
        const { name, description, quantity, image } = productData;
        return await database.query(
            "UPDATE contacts SET name=?, description=?, quantity=?, image=? WHERE id = ?;",
            [name, description, quantity, image, id + ""]
        );
    }
};

/**
 * 
 * @param id 
 * @param quantity 
 * @returns 
 */
export const QueryAdd_DecQuantity = async (id: any, quantity: any) => {
    if (!!database) {
        return await database.query(
            "UPDATE contacts SET quantity=? WHERE id = ?;",
            [quantity, id + ""]
        );
    }
};



/**
 * Delete an existing product in the database by id
 * @param barcode 
 * @returns 
 */
export const QueryDeleteProduct = async (id: any) => {
    if (!!database) {
        return await database.query("DELETE FROM products WHERE id = ?;", [ id + "", ]);
    }
};