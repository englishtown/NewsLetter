using System.IO;
using System.Net;
using HtmlAgilityPack;
using ServiceStack.Configuration;

namespace News.Biz
{
    public class LabsNews : ILabsNews
    {
        private ILogin myLogin;
        public LabsNews(ILogin login)
        {
            this.myLogin = login;
        }

        public HtmlNodeCollection NewsContent()
        {
            CookieContainer cc = myLogin.GetLogin();
            var appSettings = new AppSettings();
            string newsUrl = appSettings.GetString("LabsNews");
            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(newsUrl);
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