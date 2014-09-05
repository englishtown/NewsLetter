using System.Collections.Generic;

namespace News.DataAccess
{
    public interface IMeetOurPeopleDal
    {
        int InsertOurPeople(MeetOurPeopleEntity people);

        int UpdateOurPeople(MeetOurPeopleEntity people);

        List<MeetOurPeopleEntity> GetAllList();

        MeetOurPeopleEntity GetById(int id);

        int AddLog(Log log); 
    }
}