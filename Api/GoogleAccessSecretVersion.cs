using Google.Cloud.SecretManager.V1;

namespace PlantManager.Api
{
    public class GoogleAccessSecretVersion : ISecretManager
    {
        private readonly string _projectId;
        private readonly SecretManagerServiceClient _client;

        public GoogleAccessSecretVersion(string projectId)
        {
            _projectId = projectId;
            _client = SecretManagerServiceClient.Create();
        }

        public string AccessSecretVersion(string secretId, string secretVersionId)
        {
            if (secretId == null)
            {
                return null;
            }
            // Build the resource name.
            var secretVersionName = new SecretVersionName(_projectId, secretId, secretVersionId);

            // Call the API.
            var result = _client.AccessSecretVersion(secretVersionName);

            // Convert the payload to a string. Payloads are bytes by default.
            var payload = result.Payload.Data.ToStringUtf8();
            return payload;
        }
    }
}