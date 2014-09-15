using System;
using System.Collections.Generic;
using HtmlAgilityPack;
using News.DataAccess;
using News.Service;
using ServiceStack.Configuration;

namespace News.Biz
{
    public class OurPeople : IOurPeople
    {
        private ILabsPeople labsPeople;
        private IMeetOurPeopleDal ourPeopleDal;

        public OurPeople(ILabsPeople people, IMeetOurPeopleDal peopleDal)
        {
            this.labsPeople = people;
            this.ourPeopleDal = peopleDal;
        }

        public List<MeetOurPeopleResponse> GetPeopleResponses()
        {
            var responses = new List<MeetOurPeopleResponse>();
            var ourPeoples = this.ourPeopleDal.GetAllList();
            if (ourPeoples != null && ourPeoples.Count > 0)
            {
                foreach (var newsletter in ourPeoples)
                {
                    var responseItem = new MeetOurPeopleResponse();
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

        public void UpdateOurPeople()
        {
            HtmlNodeCollection newsContent = labsPeople.NewsContent();
            var inputIds = new List<int>();
            foreach (var trNode in newsContent)
            {
                MeetOurPeopleEntity peopleEntity = null;
                var tdNode = trNode.ChildNodes;
                //1 id
                if (tdNode[0].Name == "td")
                {
                    peopleEntity = new MeetOurPeopleEntity();
                    int id;
                    if (int.TryParse(tdNode[0].InnerText, out id))
                    {
                        peopleEntity.Id = id;
                        inputIds.Add(id);
                    }
                }

                if (peopleEntity == null)
                {
                    continue;
                }

                //2 state
                int intState;
                if (int.TryParse(tdNode[1].InnerText, out intState))
                {
                    peopleEntity.State = intState;
                }

                //3 pic
                peopleEntity.Pic = tdNode[2].FirstChild.GetAttributeValue("href", "");
                //4 label
                peopleEntity.Label = tdNode[3].InnerText;
                //5 name
                peopleEntity.Name = tdNode[4].InnerText;
                //6 position
                peopleEntity.Position = tdNode[5].InnerText;
                //7 date
                peopleEntity.Date = tdNode[6].InnerText;
                //8 desc
                peopleEntity.Desc = tdNode[7].InnerText;
                //9 pic2
                peopleEntity.Pic2 = tdNode[8].FirstChild.GetAttributeValue("href", "");
                //10 mobile
                peopleEntity.Mobile = tdNode[9].InnerText;
                //11 skype
                peopleEntity.Skype = tdNode[10].InnerText;

                var dbPeople = this.ourPeopleDal.GetById(peopleEntity.Id);
                if (dbPeople == null)
                {
                    this.ourPeopleDal.InsertOurPeople(peopleEntity);
                    continue;
                }

                dbPeople.State = peopleEntity.State;
                dbPeople.Pic = peopleEntity.Pic;
                dbPeople.Label = peopleEntity.Label;
                dbPeople.Name = peopleEntity.Name;
                dbPeople.Position = peopleEntity.Position;
                dbPeople.Date = peopleEntity.Date;
                dbPeople.Desc = peopleEntity.Desc;
                dbPeople.Pic2 = peopleEntity.Pic2;
                dbPeople.Mobile = peopleEntity.Mobile;
                dbPeople.Skype = peopleEntity.Skype;
                dbPeople.ModifyTime = DateTime.Now;
                this.ourPeopleDal.UpdateOurPeople(dbPeople);
            }
            //2
            var dbItems = this.ourPeopleDal.GetAllList();
            foreach (var item in dbItems)
            {
                bool blExists = inputIds.Contains(item.Id);
                if (!blExists)
                {
                    item.State = 0;
                    this.ourPeopleDal.UpdateOurPeople(item);
                }
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
                ourPeopleDal.AddLog(log);
            }
        }
    }
}