using System;
using System.Collections.Generic;
using News.Service;

namespace News.Biz
{
    public interface IOurPeople
    {
        List<MeetOurPeopleResponse> GetPeopleResponses();
        void UpdateOurPeople();
        void LogError(string input, Exception ex);
    }
}