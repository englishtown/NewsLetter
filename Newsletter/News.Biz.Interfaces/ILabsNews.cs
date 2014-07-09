using HtmlAgilityPack;

namespace News.Biz
{
    public interface ILabsNews
    {
        HtmlNodeCollection NewsContent();
    }
}