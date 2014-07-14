using System;
using System.Collections.Generic;
using System.Data;
using ServiceStack.OrmLite;

namespace News.DataAccess
{
    public class NewsletterDal : INewsletterDal
    {
        public int InsertNewsletter(Newsletter letter)
        {
            var currentDateTime = DateTime.Now;
            letter.CreateTime = currentDateTime;
            letter.ModifyTime = currentDateTime;

            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                intResult = (int)db.Insert(letter);
            }
            return intResult;
        }

        public int UpdateNewsletter(Newsletter letter)
        {
            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
               intResult = db.Update(letter);
            }
            return intResult;
        }

        public List<Newsletter> GetAllList()
        {
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                string sql = "select * from Newsletter where State = 1";
                return db.SqlList<Newsletter>(sql);
            }
        }

        public Newsletter GetById(int id)
        {
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {

                return db.SingleById<Newsletter>(id);
            }
        }
    }
}
