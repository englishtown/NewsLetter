using ServiceStack.Configuration;
using ServiceStack.OrmLite;
using ServiceStack.OrmLite.Sqlite;

namespace News.DataAccess
{
    internal class Common
    {
        static Common()
        {
            OrmLiteConfig.DialectProvider = new SqliteOrmLiteDialectProvider();
        }

        public static string SqliteFile
        {
            get
            {
                var appSettings = new AppSettings();
                string newsUrl = appSettings.GetString("DBFile");
                return newsUrl;
            }
        }
    }
}