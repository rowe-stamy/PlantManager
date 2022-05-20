using System;
using Raven.Client.Documents;
using Raven.Client.ServerWide.Operations;
using Raven.TestDriver;

namespace PlantManager.Tests
{
    public class RavenFixture : RavenTestDriver
    {
        public RavenFixture()
        {
            Store = GetDocumentStore();
        }

        public IDocumentStore Store { get; set; }


        public override void Dispose()
        {
            Store.Maintenance.Server.Send(new DeleteDatabasesOperation(new DeleteDatabasesOperation.Parameters
            {
                DatabaseNames = new[] {Store.Database},
                HardDelete = true,
                TimeToWaitForConfirmation = TimeSpan.FromMinutes(2)
            }));
            base.Dispose();
        }
    }
}