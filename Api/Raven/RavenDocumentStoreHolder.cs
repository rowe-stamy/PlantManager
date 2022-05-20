using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Raven.Client.Documents;
using Raven.Client.ServerWide;
using Raven.Client.ServerWide.Operations;

namespace PlantManager.Api.Raven
{
    public class RavenDocumentStoreHolder
    {
        public IDocumentStore Store { get; private set; }

        private const string DatabaseName = "PlantManager";

        public void Initialize(string connectionString, X509Certificate2 certificate)
        {
            Store = certificate == null
                ? new DocumentStore
                {
                    Urls = new[] {connectionString},
                    Database = DatabaseName
                }
                : new DocumentStore
                {
                    Certificate = certificate,
                    Urls = new[] {connectionString},
                    Database = DatabaseName
                };

            DoInit();
        }

        public void Initialize(string connectionString)
        {
            Store = new DocumentStore
            {
                Urls = new[] {connectionString},
                Database = DatabaseName
            };
            DoInit();
        }


        private async Task<bool> DbExists(string databaseName)
        {
            var dbRecord = await Store.Maintenance.Server.SendAsync(new GetDatabaseRecordOperation(databaseName));
            return dbRecord != null;
        }

        private void CreateDbIfNotExists(string databaseName)
        {
            if (!DbExists(databaseName).GetAwaiter().GetResult())
            {
                Store.Maintenance.Server.Send(new CreateDatabaseOperation(new DatabaseRecord(databaseName)));
            }
        }

        private void DoInit()
        {
            Store.Conventions.UseOptimisticConcurrency = true;
            Store.Conventions.MaxNumberOfRequestsPerSession = int.MaxValue;
            Store.Initialize();
            CreateDbIfNotExists(DatabaseName);
        }
    }
}