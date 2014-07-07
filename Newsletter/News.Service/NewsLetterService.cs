using System.Collections.Generic;
using HtmlAgilityPack;
using News.Biz;

namespace News.Service
{
    public class NewsLetterService : ServiceStack.Service
    {
        private ILabsNews labsNews;
        public NewsLetterService(ILabsNews myLabsNews)
        {
            this.labsNews = myLabsNews;
        }

        public object Any(NewsLetter request)
        {
            HtmlNodeCollection newsContent = labsNews.NewsContent();
            List<NewsLetterResponse> newsResponses = new List<NewsLetterResponse>();
            foreach (var trNode in newsContent)
            {
                NewsLetterResponse letter = null;
                var tdNode = trNode.ChildNodes;
                if (tdNode[0].Name == "td")
                {
                    letter = new NewsLetterResponse();
                    letter.Id = tdNode[0].InnerText;
                }

                if (letter == null)
                {
                    continue;
                }

                letter.Description = tdNode[1].InnerText;

                letter.PhotoAddress = tdNode[2].FirstChild.GetAttributeValue("href","");

                newsResponses.Add(letter);
            }

            return newsResponses;
        }
    }
}