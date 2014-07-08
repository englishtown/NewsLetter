using System;

namespace News.DataAccess
{
    public class Newsletter
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public int State { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime ModifyTime { get; set; }
    }
}