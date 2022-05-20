using System;
using Microsoft.Extensions.Configuration;

namespace PlantManager.Api
{
    public static class ConfigurationExtensions
    {
        public static AppConfiguration GetAppConfiguration(this IConfiguration configuration,
            string environment, InfrastructurePlatform platform)
        {
            var appConfiguration = new AppConfiguration {Environment = environment};


            ISecretManager secretManager = platform switch
            {
                InfrastructurePlatform.GCP => new GoogleAccessSecretVersion(GetSetting(platform, configuration,
                    "SecretManager", "ProjectId")),
                InfrastructurePlatform.AZURE => new AzureKeyVaultAccess(GetSetting(platform, configuration,
                    "SecretManager", "ProjectId")),
                InfrastructurePlatform.AZURE_FUNCTIONS => new LocalConfigAccess(),
                InfrastructurePlatform.LOCAL => new LocalConfigAccess(),
                InfrastructurePlatform.AZURE_FUNCTIONS_LOCAL => new LocalConfigAccess(),
                _ => throw new ArgumentOutOfRangeException(nameof(platform), platform, null)
            };

            appConfiguration.RavenConnectionString = GetSetting(platform, configuration, "Raven", "ConnectionString");
            appConfiguration.RavenCertificateName = GetSetting(platform, configuration, "Raven", "Certificate");
            appConfiguration.BlobStorageConnectionString =
                secretManager.AccessSecretVersion(
                    GetSetting(platform, configuration, "SecretManager", "BlobStorageConnectionString", "Name"),
                    GetSetting(platform, configuration, "SecretManager", "BlobStorageConnectionString", "Version"));

            return appConfiguration;
        }

        private static string GetSetting(InfrastructurePlatform platform, IConfiguration configuration, params string[] parts)
        {
            return platform == InfrastructurePlatform.AZURE_FUNCTIONS || platform == InfrastructurePlatform.AZURE_FUNCTIONS_LOCAL
                ? configuration[string.Join("_", parts)]
                : configuration[ string.Join(":", parts)];
        }
    }
}