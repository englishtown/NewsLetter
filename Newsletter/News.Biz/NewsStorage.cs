using System;
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
            var responses = new List<NewsLetterResponse>();
            var newsletters = this.newsletterDal.GetAllList();
            if (newsletters != null && newsletters.Count > 0)
            {
                foreach (var newsletter in newsletters)
                {
                    var responseItem = new NewsLetterResponse();
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

                int intState;
                if (int.TryParse(tdNode[3].InnerText, out intState))
                {
                    letter.State = intState;
                }

                var dbLetter = this.newsletterDal.GetById(letter.Id);
                if (dbLetter == null)
                {
                    this.newsletterDal.InsertNewsletter(letter);    
                    continue;
                }
                
                dbLetter.Description = letter.Description;
                dbLetter.Picture = letter.Picture;
                dbLetter.State = letter.State;
                dbLetter.ModifyTime = DateTime.Now;
                this.newsletterDal.UpdateNewsletter(dbLetter);
            }
        }
    }
}