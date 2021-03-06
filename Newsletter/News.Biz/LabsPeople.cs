﻿using System.IO;
using System.Net;
using HtmlAgilityPack;
using ServiceStack;
using ServiceStack.Configuration;

namespace News.Biz
{
    public class LabsPeople : ILabsPeople
    {
        public HtmlNodeCollection NewsContent()
        {
            var appSettings = new AppSettings();
            var client = new JsonServiceClient
            {
                UserName = appSettings.GetString("CfName"),
                Password = appSettings.GetString("CfPwd"),
                AlwaysSendBasicAuthHeader = true
            };
            var jsonRes = client.Get<string>(appSettings.GetString("MeetOurPeople"));
            var dd = DynamicJson.Deserialize(jsonRes);
            string sHtml = dd.body.view.value;
            HtmlDocument htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(sHtml);
            HtmlNodeCollection nodeCollection = htmlDoc.DocumentNode.SelectNodes(@"//table/tbody/tr");
            return nodeCollection;
        }
    }
}