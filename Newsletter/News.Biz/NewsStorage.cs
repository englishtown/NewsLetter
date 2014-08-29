using System;
using System.Collections.Generic;
using HtmlAgilityPack;
using News.DataAccess;
using News.Service;
using ServiceStack.Configuration;

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
                    responseItem.pic = newsletter.Pic;
                    responseItem.label = newsletter.Label;
                    responseItem.name = newsletter.Name;
                    responseItem.position = newsletter.Position;
                    responseItem.date = newsletter.Date;
                    responseItem.desc = newsletter.Desc;
                    responseItem.pic2 = newsletter.Pic2;
                    responseItem.mobile = newsletter.Mobile;
                    responseItem.skype = newsletter.Skype;
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
                //1 id
                if (tdNode[0].Name == "td")
                {
                    letter = new Newsletter();
                    int id;
                    if (int.TryParse(tdNode[0].InnerText, out id))
                    {
                        letter.Id = id;
                    }
                }

                if (letter == null)
                {
                    continue;
                }

                //2 state
                int intState;
                if (int.TryParse(tdNode[1].InnerText, out intState))
                {
                    letter.State = intState;
                }

                //3 pic
                letter.Pic = tdNode[2].FirstChild.GetAttributeValue("href", "");
                //4 label
                letter.Label = tdNode[3].InnerText;
                //5 name
                letter.Name = tdNode[4].InnerText;
                //6 position
                letter.Position = tdNode[5].InnerText;
                //7 date
                letter.Date = tdNode[6].InnerText;
                //8 desc
                letter.Desc = tdNode[7].InnerText;
                //9 pic2
                letter.Pic2 = tdNode[8].FirstChild.GetAttributeValue("href", "");
                //10 mobile
                letter.Mobile = tdNode[9].InnerText;
                //11 skype
                letter.Skype = tdNode[10].InnerText;

                var dbLetter = this.newsletterDal.GetById(letter.Id);
                if (dbLetter == null)
                {
                    this.newsletterDal.InsertNewsletter(letter);
                    continue;
                }

                dbLetter.State = letter.State;
                dbLetter.Pic = letter.Pic;
                dbLetter.Label = letter.Label;
                dbLetter.Name = letter.Name;
                dbLetter.Position = letter.Position;
                dbLetter.Date = letter.Date;
                dbLetter.Desc = letter.Desc;
                dbLetter.Pic2 = letter.Pic2;
                dbLetter.Mobile = letter.Mobile;
                dbLetter.Skype = letter.Skype;
                dbLetter.ModifyTime = DateTime.Now;
                this.newsletterDal.UpdateNewsletter(dbLetter);
            }
        }

        public void LogError(string input, Exception ex)
        {
            var appSettings = new AppSettings();
            var isLog = appSettings.GetString("IsLog");
            if (!string.IsNullOrEmpty(isLog) && isLog == "true")
            {
                var log = new Log();
                log.Input = input ?? "";
                log.Message = string.Format("Message:{0} Stack:{1}", ex.Message, ex.StackTrace);
                log.CreateTime = DateTime.Now;
                newsletterDal.AddLog(log);
            }
        }
    }
}