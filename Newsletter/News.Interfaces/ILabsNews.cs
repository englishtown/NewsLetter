using HtmlAgilityPack;

namespace News.Interfaces
{
    public interface ILabsNews
    {
        HtmlNodeCollection NewsContent();
    }
}