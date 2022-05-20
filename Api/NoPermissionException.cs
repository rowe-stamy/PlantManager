namespace PlantManager.Api
{
    public class NoPermissionException : BusinessException
    {
        public NoPermissionException() : base(OperationNotPermitted)
        {
        }
    }
}