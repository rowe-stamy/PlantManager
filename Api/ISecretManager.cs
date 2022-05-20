namespace PlantManager.Api
{
    public interface ISecretManager
    {
        string AccessSecretVersion(string secretId, string secretVersionId);
    }
}