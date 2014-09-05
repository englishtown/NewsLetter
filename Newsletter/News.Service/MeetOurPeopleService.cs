using System;
using News.Biz;

namespace News.Service
{
    public class MeetOurPeopleService : ServiceStack.Service
    {
        private IOurPeople ourPeople;

        public MeetOurPeopleService(IOurPeople people)
        {
            ourPeople = people;
        }

        public object Any(MeetOurPeople request)
        {
            try
            {
                //1 update datas;
                ourPeople.UpdateOurPeople();
            }
            catch (Exception ex)
            {
                //Write log...
                ourPeople.LogError(request.Id, ex);
            }

            //2 get all datas;
            return ourPeople.GetPeopleResponses();
        }
    }
}