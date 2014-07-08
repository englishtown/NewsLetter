using System.Collections.Generic;

namespace News.DataAccess
{
    public interface INewsletterDal
    {
        int InsertNewsletter(Newsletter letter);

        int DeleteNewsletter(Newsletter letter);

        int UpdateNewsletter(Newsletter letter);

        List<Newsletter> GetAllList();
    }
}