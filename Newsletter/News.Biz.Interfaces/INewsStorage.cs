using System.Collections.Generic;
using News.Service;

namespace News.Biz
{
    public interface INewsStorage
    {
        List<NewsLetterResponse> GetNewsLetter();
        void UpdateNews();
    }
}