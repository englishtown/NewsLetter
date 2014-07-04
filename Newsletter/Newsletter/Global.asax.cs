using System;
using News.Biz;
using News.Interfaces;
using Newsletter;
using ServiceStack;

namespace News.Service
{
    public class AppHost : AppHostBase
    {
        //Tell ServiceStack the name of your application and where to find your services
        public AppHost() : base("Newsletter", typeof(NewsLetterService).Assembly) { }

        public override void Configure(Funq.Container container)
        {
            container.RegisterAutoWiredAs<Login, ILogin>();
            container.RegisterAutoWiredAs<LabsNews, ILabsNews>();
        }
    }

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            new AppHost().Init();
        }
    }
}