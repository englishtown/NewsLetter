using System.Net;

namespace News.Interfaces
{
    public interface ILogin
    {
        CookieContainer GetLogin();
    }
}