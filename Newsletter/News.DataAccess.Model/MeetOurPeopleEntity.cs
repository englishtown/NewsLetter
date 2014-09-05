using System;

namespace News.DataAccess
{
    public class MeetOurPeopleEntity
    {
        public int Id { get; set; }
        public int State { get; set; }
        public string Pic { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public string Date { get; set; }
        public string Desc { get; set; }
        public string Pic2 { get; set; }
        public string Mobile { get; set; }
        public string Skype { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime ModifyTime { get; set; } 
    }
}