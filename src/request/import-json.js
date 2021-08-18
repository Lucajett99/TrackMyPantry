const now = parseInt(new Date().getTime() / 1000);
console.log(now);
const dataToImport = {
  database: "MyPantry",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "products",
      schema: [
        { column: "id", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "barcode", value: "TEXT NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "description", value: "TEXT" },
        { column: "quantity", value: "INTEGER" },
        { column: "image", value: "TEXT" },
        {
          column: "last_modified",
          value: "INTEGER DEFAULT (strftime('%s', 'now'))",
        },
      ],
      // indexes: [{ name: "index_user_on_email", column: "email" }],
      values: [
        [1, 1, "Nutella", "Dolce", 1, null, now],
        [2, 2, "Coca Cola", "Bibita", 6, null, now],
        [3, 3, "Maionese", "Salsa", 2, null, now],
        [4, 4, "Pomodori", "Verdura", 20, null, now],
      ],
    },
  ],
};
export default dataToImport;

//CREATE TRIGGER contacts_trigger_last_modified AFTER UPDATE ON contacts FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified BEGIN UPDATE contacts SET last_modified = (strftime('%s','now')) WHERE id=OLD.id; END;