using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using PlantManager.Api;
using PlantManager.Api.Behaviour;
using PlantManager.Api.Model;
using Xunit;

namespace PlantManager.Tests
{
    public class RecordExtractionTests : IClassFixture<RavenFixture>
    {
        private readonly RavenFixture _ravenFixture;

        public RecordExtractionTests(RavenFixture ravenFixture)
        {
            _ravenFixture = ravenFixture;
        }

        [Fact]
        public async Task ShouldRecordExtraction()
        {
            // arrange
            using var session = _ravenFixture.Store.OpenAsyncSession();
            var currentRequest = new Mock<ICurrentRequest>();
            var currentTime = new DateTimeOffset(2020, 8, 1, 15, 0, 0, TimeSpan.Zero);
            var clock = new Mock<IClock>();
            clock.Setup(m => m.GetTime()).Returns(currentTime);
            var state = new State(session, currentRequest.Object, clock.Object);
            const string plantId = "plant-1";
            const string fractionId = "fraction-1";
            const string extractionId = "extraction-1";
            const string chargeId = "charge-1";
            await state.AddAsync(new Plant
            {
                Id = plantId,
                Fractions = new List<Fraction>
                {
                    new()
                    {
                        Id = fractionId,
                        ChargeId = chargeId
                    }
                },
                Name = "some plant"
            });

            // act
            var command = new RecordExtraction
            {
                Comment = "",
                ExtractionId = extractionId,
                FractionId = fractionId,
                PlantId = plantId,
                WeightInKg = 5
            };

            await command.HandleAsync(state);

            // assert
            var extraction = await state.GetByIdStrictAsync<Extraction>(extractionId);
            extraction.WeightInKg.Should().Be(5);
        }
    }
}