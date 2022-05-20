using System;

namespace PlantManager.Api
{
    public class Clock : IClock
    {
        public DateTimeOffset GetTime()
        {
            return DateTimeOffset.Now;
        }
    }
}