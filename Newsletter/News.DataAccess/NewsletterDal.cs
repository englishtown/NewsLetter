using System.Collections.Generic;
using System.Data;
using ServiceStack.OrmLite;

namespace News.DataAccess
{
    public class NewsletterDal : INewsletterDal
    {
        public int InsertNewsletter(Newsletter letter)
        {
            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                intResult = (int)db.Insert(letter);
            }
            return intResult;
        }

        public int DeleteNewsletter(Newsletter letter)
        {
            throw new System.NotImplementedException();
        }

        public int UpdateNewsletter(Newsletter letter)
        {
            throw new System.NotImplementedException();
        }

        public List<Newsletter> GetAllList()
        {
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                return db.Select<Newsletter>();
            }
        }
    }
}
