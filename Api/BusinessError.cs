using System;
using System.Collections.Generic;

namespace PlantManager.Api
{
    public class BusinessError : Entity
    {
        public string Message { get; set; }

        public ICollection<ICommand> CallStack { get; set; }
    }
}