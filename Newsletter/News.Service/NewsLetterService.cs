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
            //1 update datas;
            newsStorage.UpdateNews();
            //2 get all datas;
            return newsStorage.GetNewsLetter();
        }
    }
}