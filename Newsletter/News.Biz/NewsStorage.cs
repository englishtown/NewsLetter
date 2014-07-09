using System.Collections.Generic;
using HtmlAgilityPack;
using News.DataAccess;
using News.Service;

namespace News.Biz
{
    public class NewsStorage : INewsStorage
    {
        private ILabsNews labsNews;
        private INewsletterDal newsletterDal;

        public NewsStorage(ILabsNews news, INewsletterDal newsletter)
        {
            this.labsNews = news;
            this.newsletterDal = newsletter;
        }

        public List<NewsLetterResponse> GetNewsLetter()
        {
            List<NewsLetterResponse> responses = new List<NewsLetterResponse>();
            List<Newsletter> newsletters = this.newsletterDal.GetAllList();
            if (newsletters != null && newsletters.Count > 0)
            {
                foreach (var newsletter in newsletters)
                {
                    NewsLetterResponse responseItem = new NewsLetterResponse();
                    responseItem.Id = newsletter.Id.ToString();
                    responseItem.PhotoAddress = newsletter.Picture;
                    responseItem.Description = newsletter.Description;
                    responses.Add(responseItem);
                }
            }

            return responses;
        }

        public void UpdateNews()
        {
            HtmlNodeCollection newsContent = labsNews.NewsContent();
            foreach (var trNode in newsContent)
            {
                Newsletter letter = null;
                var tdNode = trNode.ChildNodes;
                if (tdNode[0].Name == "td")
                {
                    letter = new Newsletter();
                    int id;
                    if (int.TryParse(tdNode[0].InnerText,out id))
                    {
                        letter.Id = id;
                    }
                }

                if (letter == null)
                {
                    continue;
                }

                letter.Description = tdNode[1].InnerText;
                letter.Picture = tdNode[2].FirstChild.GetAttributeValue("href", "");

                this.newsletterDal.InsertNewsletter(letter);
            }
        }
    }
}