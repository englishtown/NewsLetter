using System;
using System.Collections.Generic;
using System.Data;
using ServiceStack.OrmLite;

namespace News.DataAccess
{
    public class MeetOurPeopleDal : IMeetOurPeopleDal
    {
        public int InsertOurPeople(MeetOurPeopleEntity people)
        {
            var currentDateTime = DateTime.Now;
            people.CreateTime = currentDateTime;
            people.ModifyTime = currentDateTime;

            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                intResult = (int)db.Insert(people);
            }
            return intResult;
        }

        public int UpdateOurPeople(MeetOurPeopleEntity people)
        {
            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                intResult = db.Update(people);
            }
            return intResult;
        }

        public List<MeetOurPeopleEntity> GetAllList()
        {
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                string sql = "select * from MeetOurPeopleEntity where State = 1";
                return db.SqlList<MeetOurPeopleEntity>(sql);
            }
        }

        public MeetOurPeopleEntity GetById(int id)
        {
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {

                return db.SingleById<MeetOurPeopleEntity>(id);
            }
        }

        public int AddLog(Log log)
        {
            int intResult = 0;
            using (IDbConnection db = Common.SqliteFile.OpenDbConnection())
            {
                intResult = (int)db.Insert(log);
            }
            return intResult;
        }
    }
}