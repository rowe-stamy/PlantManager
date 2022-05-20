namespace PlantManager.Api
{
    public class LocalConfigAccess : ISecretManager
    {
        public string AccessSecretVersion(string secretId, string secretVersionId)
        {
            return secretId;
        }
    }
}