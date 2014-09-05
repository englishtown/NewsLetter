using System.IO;
using System.Net;
using HtmlAgilityPack;
using ServiceStack.Configuration;

namespace News.Biz
{
    public class LabsPeople : ILabsPeople
    {
        private ILogin myLogin;
        public LabsPeople(ILogin login)
        {
            this.myLogin = login;
        }

        public HtmlNodeCollection NewsContent()
        {
            CookieContainer cc = myLogin.GetLogin();
            var appSettings = new AppSettings();
            string url = appSettings.GetString("MeetOurPeople");
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(url);
            myRequest.CookieContainer = cc;
            HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse();
            cc.Add(myResponse.Cookies);
            Stream myStream = myResponse.GetResponseStream();
            string sHtml = new StreamReader(myStream, System.Text.Encoding.Default).ReadToEnd();

            //HtmlWeb htmlWeb = new HtmlWeb();
            HtmlDocument htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(sHtml);
            HtmlNodeCollection nodeCollection = htmlDoc.DocumentNode.SelectNodes(@"//*[@id='content']/div[5]/div[1]/table/tbody/tr");
            return nodeCollection;
        }
    }
}