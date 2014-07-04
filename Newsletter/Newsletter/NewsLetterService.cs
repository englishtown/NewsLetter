using System.Collections.Generic;
using HtmlAgilityPack;
using News.Interfaces;
using ServiceStack;

namespace Newsletter
{
    [Route("/newsletter")]
    public class NewsLetter
    {
        public string Id { get; set; }
    }

    public class NewsLetterResponse
    {
        public string Id { get; set; }
        public string PhotoAddress { get; set; }
        public string Description { get; set; }
    }

    public class NewsLetterService : Service
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