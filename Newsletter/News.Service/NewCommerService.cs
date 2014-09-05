using System;
using News.Biz;

namespace News.Service
{
    public class NewCommerService : ServiceStack.Service
    {
        private INewsStorage newsStorage;
        public NewCommerService(INewsStorage storage)
        {
            this.newsStorage = storage;
        }

        public object Any(NewCommer request)
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