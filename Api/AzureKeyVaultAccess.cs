using System;
using Azure.Core;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace PlantManager.Api
{
    public class AzureKeyVaultAccess : ISecretManager
    {
        private readonly SecretClient _client;

        public AzureKeyVaultAccess(string projectId)
        {
            var options = new SecretClientOptions
            {
                Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = RetryMode.Exponential
                }
            };
            _client = new SecretClient(new Uri($"https://{projectId}.vault.azure.net/"), new DefaultAzureCredential(), options);
        }

        public string AccessSecretVersion(string secretId, string secretVersionId)
        {
            if (secretId == null)
            {
                return null;
            }

            KeyVaultSecret secret = _client.GetSecret(secretId);

            return secret.Value;
        }
    }
}