namespace PlantManager.Api
{
    public class AppConfiguration
    {
        public string Environment { get; set; }

        public string BlobStorageConnectionString { get; set; }

        public string RavenConnectionString { get; set; }

        public string RavenCertificateName { get; set; }
    }
}