using Microsoft.Data.Sqlite;

var connectionString = ""Data Source=app.db"";
using var connection = new SqliteConnection(connectionString);
connection.Open();

var command = connection.CreateCommand();
command.CommandText = ""SELECT name FROM sqlite_master WHERE type='table' AND name='University'"";
var result = command.ExecuteScalar();

Console.WriteLine(result != null ? ""University table exists"" : ""University table does not exist"");
