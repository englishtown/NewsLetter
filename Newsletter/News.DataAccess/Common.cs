using System;
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
                //var appSettings = new AppSettings();
                //appSettings.GetString("DBFile");
                string newsUrl = string.Concat(AppDomain.CurrentDomain.BaseDirectory, "\\Contents\\EFNews");
                return newsUrl;
            }
        }
    }
}