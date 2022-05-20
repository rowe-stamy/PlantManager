using System;

namespace PlantManager.Api
{
    public class BusinessException : Exception
    {
        public BusinessException(string message) : base(message)
        {
            
        }

        public static string OperationNotPermitted => nameof(OperationNotPermitted);

        public static string ChargeNotFound => nameof(ChargeNotFound);

        public static string FractionIdMustBeUniqueOnPlant => nameof(FractionIdMustBeUniqueOnPlant);
    }
}