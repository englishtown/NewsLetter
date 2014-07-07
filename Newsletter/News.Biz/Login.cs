using System.IO;
using System.Net;
using System.Text;
using ServiceStack.Configuration;

namespace News.Biz
{
    public class Login : ILogin
    {

        public CookieContainer GetLogin()
        {
            CookieContainer cc = new CookieContainer();
            var appSettings = new AppSettings();
            string loginURL = appSettings.GetString("loginAddress");
            string userName = appSettings.GetString("CfName");
            string pwd = appSettings.GetString("CfPwd");
            string formData = string.Format("os_username={0}&os_password={1}", userName, pwd);
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] data = encoding.GetBytes(formData);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(loginURL);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;
            request.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)";
            //mock one UserAgent
            Stream newStream = request.GetRequestStream();
            newStream.Write(data, 0, data.Length);
            newStream.Close();
            request.CookieContainer = cc;
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            cc.Add(response.Cookies);
            return cc;
        }
    }
}