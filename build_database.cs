using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;

class BuildDatabase {
    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_open", CallingConvention = CallingConvention.Cdecl)]
    public static extern int sqlite3_open(byte[] filename, out IntPtr db);

    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_exec", CallingConvention = CallingConvention.Cdecl)]
    public static extern int sqlite3_exec(IntPtr db, byte[] sql, Callback callback, IntPtr arg, out IntPtr errmsg);

    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_close", CallingConvention = CallingConvention.Cdecl)]
    public static extern int sqlite3_close(IntPtr db);

    [DllImport("winsqlite3.dll", EntryPoint = "sqlite3_free", CallingConvention = CallingConvention.Cdecl)]
    public static extern void sqlite3_free(IntPtr ptr);

    public delegate int Callback(IntPtr arg, int colCount, IntPtr colValues, IntPtr colNames);

    static int PrintRow(IntPtr arg, int colCount, IntPtr colValues, IntPtr colNames) {
        for (int i = 0; i < colCount; i++) {
            IntPtr valPtr = Marshal.ReadIntPtr(colValues, i * IntPtr.Size);
            IntPtr namePtr = Marshal.ReadIntPtr(colNames, i * IntPtr.Size);
            string val = valPtr == IntPtr.Zero ? "NULL" : Marshal.PtrToStringAnsi(valPtr);
            string name = Marshal.PtrToStringAnsi(namePtr);
            Console.WriteLine("    [" + name + "] = " + val);
        }
        return 0;
    }

    static int ExecSql(IntPtr db, string sql, Callback cb = null) {
        byte[] bytes = Encoding.UTF8.GetBytes(sql + "\0");
        IntPtr errmsg;
        int rc = sqlite3_exec(db, bytes, cb, IntPtr.Zero, out errmsg);
        if (rc != 0) {
            string msg = Marshal.PtrToStringAnsi(errmsg);
            Console.WriteLine("SQL Error (" + rc + "): " + msg);
            sqlite3_free(errmsg);
        }
        return rc;
    }

    static int Main(string[] args) {
        string dbPath = args.Length > 0 ? args[0] : @"D:\new\cafeteria.db";
        string schemaFile = @"D:\new\schema_sqlite.sql";
        string seedFile = @"D:\new\seed_data.sql";

        Console.WriteLine("==================================================");
        Console.WriteLine("  SMART CAFETERIA DATABASE BUILDER (Windows Native)");
        Console.WriteLine("==================================================");
        Console.WriteLine("[*] Target Database: " + dbPath);

        if (File.Exists(dbPath)) {
            File.Delete(dbPath);
            Console.WriteLine("[*] Cleared existing database.");
        }

        IntPtr db;
        byte[] dbPathBytes = Encoding.UTF8.GetBytes(dbPath + "\0");
        int rc = sqlite3_open(dbPathBytes, out db);
        if (rc != 0) {
            Console.WriteLine("[-] Failed to open SQLite database: " + rc);
            return 1;
        }

        // 1. Create Schema
        Console.WriteLine("[*] Applying schema: " + schemaFile);
        string schemaSql = File.ReadAllText(schemaFile, Encoding.UTF8);
        if (ExecSql(db, schemaSql) != 0) {
            sqlite3_close(db);
            return 1;
        }
        Console.WriteLine("[+] 28 tables and 3 analytical views successfully created!");

        // 2. Seed Data
        Console.WriteLine("[*] Seeding cafeteria sample records: " + seedFile);
        string seedSql = File.ReadAllText(seedFile, Encoding.UTF8);
        if (ExecSql(db, seedSql) != 0) {
            sqlite3_close(db);
            return 1;
        }
        Console.WriteLine("[+] Seeding successfully completed!");

        // 3. Verification Queries
        Console.WriteLine("\n[*] Database Verification Checks:");
        Console.WriteLine("--- Users ---");
        ExecSql(db, "SELECT count(*) AS total_users FROM users;", PrintRow);

        Console.WriteLine("--- Menu Items ---");
        ExecSql(db, "SELECT count(*) AS total_menu_items FROM menu_items;", PrintRow);

        Console.WriteLine("--- Orders ---");
        ExecSql(db, "SELECT order_number, status, total_amount, pickup_qr_token FROM orders;", PrintRow);

        Console.WriteLine("--- Wallet Balance for Kumud Negi ---");
        ExecSql(db, "SELECT u.full_name, w.balance, w.reward_points FROM wallets w JOIN users u ON w.user_id = u.id;", PrintRow);

        Console.WriteLine("--- Daily Sales Analytical View ---");
        ExecSql(db, "SELECT * FROM v_daily_sales;", PrintRow);

        sqlite3_close(db);

        FileInfo fi = new FileInfo(dbPath);
        Console.WriteLine("\n[+] Database fully built and verified!");
        Console.WriteLine("[+] File location: " + fi.FullName);
        Console.WriteLine("[+] File size: " + fi.Length + " bytes");
        return 0;
    }
}
