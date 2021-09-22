const now = parseInt(new Date().getTime() / 1000);
const dataToImport = {
  database: "MyPantry",
  version: 1,
  encrypted: false,
  mode: "partial",
  tables: [
    {
      name: "products",
      schema: [
        { column: "id", value: "TEXT NOT NULL" },
        { column: "barcode", value: "TEXT NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "description", value: "TEXT" },
        { column: "quantity", value: "INTEGER" },
        { column: "image", value: "TEXT" },
        { column: "email", value: "TEXT"},
        {
          column: "last_modified",
          value: "INTEGER DEFAULT (strftime('%s', 'now'))",
        },
        { constraint: 'PK_id_email', value: 'PRIMARY KEY (id,email)'},
        
      ],
      // indexes: [{ name: "index_user_on_email", column: "email" }],
      values: [      ],
    },
  ],
};
export default dataToImport;

//CREATE TRIGGER contacts_trigger_last_modified AFTER UPDATE ON contacts FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified BEGIN UPDATE contacts SET last_modified = (strftime('%s','now')) WHERE id=OLD.id; END;