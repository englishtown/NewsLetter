using ServiceStack;

namespace News.Service
{
    [Route("/newsletter")]
    public class NewsLetter
    {
        public string Id { get; set; }
    }
}
