using System;

namespace PlantManager.Api
{
    public interface IClock
    {
        DateTimeOffset GetTime();
    }
}