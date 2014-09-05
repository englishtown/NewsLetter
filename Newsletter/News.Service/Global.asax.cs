﻿using System;
using News.Biz;
using News.DataAccess;
using ServiceStack;

namespace News.Service
{
    public class AppHost : AppHostBase
    {
        //Tell ServiceStack the name of your application and where to find your services
        public AppHost() : base("Newsletter", typeof(NewCommerService).Assembly) { }

        public override void Configure(Funq.Container container)
        {
            container.RegisterAutoWiredAs<Login, ILogin>();
            container.RegisterAutoWiredAs<LabsNews, ILabsNews>();
            container.RegisterAutoWiredAs<NewsletterDal, INewsletterDal>();
            container.RegisterAutoWiredAs<NewsStorage, INewsStorage>();

            container.RegisterAutoWiredAs<OurPeople, IOurPeople>();
            container.RegisterAutoWiredAs<LabsPeople, ILabsPeople>();
            container.RegisterAutoWiredAs<MeetOurPeopleDal, IMeetOurPeopleDal>();


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