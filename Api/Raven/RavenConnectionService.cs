using System.IO;
using System.Security.Cryptography.X509Certificates;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;

namespace PlantManager.Api.Raven
{
    public class RavenConnectionService
    {
        private readonly AppConfiguration _appConfiguration;
        private readonly RavenDocumentStoreHolder _ravenDocumentStoreHolder;
        private readonly ILogger<RavenConnectionService> _logger;

        public RavenConnectionService(RavenDocumentStoreHolder ravenDocumentStoreHolder,
            ILogger<RavenConnectionService> logger, AppConfiguration appConfiguration)
        {
            _ravenDocumentStoreHolder = ravenDocumentStoreHolder;
            _logger = logger;
            _appConfiguration = appConfiguration;
        }

        public void CreateConnection()
        {
            var ravenConnectionString = _appConfiguration.RavenConnectionString;
            if (string.IsNullOrEmpty(_appConfiguration.RavenCertificateName))
            {
                _logger.LogInformation("raven connect w/o certificate");
                _ravenDocumentStoreHolder.Initialize(ravenConnectionString);
                _logger.LogInformation("connection to raven successful!");
                return;
            }

            _logger.LogInformation("raven connect with certificate");

            var containerClient =
                new BlobContainerClient(_appConfiguration.BlobStorageConnectionString, "certificates");
            var client = containerClient.GetBlobClient(_appConfiguration.RavenCertificateName);
            var result = client.Download();
            var certContent = new MemoryStream();
            result.Value.Content.CopyTo(certContent);
            _logger.LogInformation("certificate downloaded.");
            _logger.LogInformation("cert w/o password.");
            var certificate = new X509Certificate2(certContent.ToArray());
            result.Value.Dispose();
            certContent.Dispose();
            _logger.LogInformation("try connect to raven...");
            _ravenDocumentStoreHolder.Initialize(ravenConnectionString, certificate);
            _logger.LogInformation("connection to raven successful!");
        }
    }
}