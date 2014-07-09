using News.Biz;

namespace News.Service
{
    public class NewsLetterService : ServiceStack.Service
    {
        private INewsStorage newsStorage;
        public NewsLetterService(INewsStorage storage)
        {
            this.newsStorage = storage;
        }

        public object Any(NewsLetter request)
        {
            return newsStorage.GetNewsLetter();
        }
    }
}