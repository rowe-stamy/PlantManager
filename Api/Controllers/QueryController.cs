using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PlantManager.Api.Model;
using PlantManager.Api.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace PlantManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QueryController : Controller
    {
        private readonly IState _state;
        private readonly ILogger<QueryController> _logger;

        public QueryController(IState state, ILogger<QueryController> logger)
        {
            _state = state;
            _logger = logger;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> Plants([FromBody] PlantsQuery query)
        {
            return await GetResultAsync(query);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> Extractions([FromBody] ExtractionsQuery query)
        {
            return await GetResultAsync(query);
        }


        private async Task<ActionResult> GetResultAsync(IQuery query)
        {
            try
            {
                return Ok(await query.RunAsync(_state));
            }
            catch (EntityNotFound<User>)
            {
                return Ok(new List<object>());
            }
            catch (NoPermissionException e)
            {
                _logger.LogInformation($"no permission in query controller, {query.GetType()}");
                return Ok(new List<object>());
            }
            catch (Exception e)
            {
                _logger.LogError(e, "error in query controller");
                return Ok(new List<object>());
            }
        }
    }
}