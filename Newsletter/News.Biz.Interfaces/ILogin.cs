using System.Net;

namespace News.Biz
{
    public interface ILogin
    {
        CookieContainer GetLogin();
    }
}