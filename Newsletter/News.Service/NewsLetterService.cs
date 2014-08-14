using System;
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
            try
            {
                //1 update datas;
                newsStorage.UpdateNews();
            }
            catch (Exception ex)
            {
                //Write log...
                newsStorage.LogError(request.Id,ex);
            }

            //2 get all datas;
            return newsStorage.GetNewsLetter();
        }
    }
}