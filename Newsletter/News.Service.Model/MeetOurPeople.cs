using ServiceStack;

namespace News.Service
{
    [Route("/meetourpeople")]
    public class MeetOurPeople
    {
        public string Id { get; set; }
    }
}