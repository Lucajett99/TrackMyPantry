import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import jsonData from './DB-schema.js'
import { productData } from "./utility";
  
// The shared database instance
let database: SQLiteDBConnection | null = null;
const SQLite = new SQLiteConnection(CapacitorSQLite);

/**
 * This function initializes the database
 */
export const initDatabase = async () => {
    try {
        // Create & setup a connection object
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
    } catch (error: any) {
        window.alert(error);
        throw Error(error);
    }
};

/**
 * This function close the connection with the database
 */
export const closeConnection = async () => {
    if(!!database)
        await SQLite.closeConnection("MyPantry");
}


/**
 * This function is used to search for products with a certain email in the database
 * @param email the email of the current user
 * @returns all products of a user that have quantities greater than zero
 */
export const QueryGetProducts = async (email: string) => {
    if (!!database)
        return await database.query("SELECT * FROM products WHERE email = ? AND quantity > 0;",
        [email + ""]
        );
}

/**
 * This function is used to search for products with a certain email in the database
 * @param email the e-mail of the current user
 * @returns all products of a user that have quantities equal to zero
 */
 export const QueryShoppingList = async (email: string) => {
    if (!!database)
        return await database.query("SELECT * FROM products WHERE email = ? AND quantity = 0;",
        [email + ""]
        );
}

/**
 * This function is used to check if a product is already present in the database
 * @param id the id of the product
 * @param email the e-mail of the current user
 * @returns the product if present, undefined otherwise
 */
 export const QueryCheckProductsByPK = async (id: string, email: string) => {
    if (!!database) {
        const response = await database.query("SELECT * FROM products WHERE id = ? AND email = ?;",
        [id, email + ""]
        );
        return response?.values;
    }
}

/**
 * This function is used to add a new product in the database
 * @param productData //dato da definire
 */
export const QueryCreateProduct = async (productData: productData) => {
    if (!!database) {
        const { id, barcode, name, description, image, email } = productData;
        if(id && barcode && name && description && email) {
            await database.run(
                "INSERT INTO products (id,barcode,name,description,quantity,image,email) VALUES(?,?,?,?,?,?,?)",
                [id, barcode, name, description, 1, image, email]
            );
        }
    }
};

/**
 * This function is used to set the quantity to 1 of an existing product
 * @param email the e-mail of the current user
 * @param id the id of the product
 */
export const QueryUpdateProduct = async (email: string, id: string) => {
    if(!!database) {
        await database.query(
            "UPDATE products SET quantity=1 WHERE id = ? AND email = ?;",
        [id, email + ""]
        );
    }
  };

/**
 * This function is used to increase or decrease the quantity of an existing product
 * @param id the id of the product
 * @param quantity the quantity of the product
 */
export const QueryAdd_DecQuantity = async (id: any, quantity: any, email: string) => {
    if (!!database) {
        await database.query(
            "UPDATE products SET quantity=? WHERE id = ? AND email = ?;",
            [quantity, id, email + ""]
        );
    }
};


/**
 * This function is used to delete a product in the database
 * @param id the id of the product
 * @param email the e-mail of the current user
 */
export const QueryDeleteProduct = async (id: string, email: string) => {
    if (!!database) {
        await database.query("DELETE FROM products WHERE id = ? AND email = ?;", [ id, email + "", ]);
    }
};
