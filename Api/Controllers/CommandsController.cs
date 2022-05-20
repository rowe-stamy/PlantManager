using System.Threading.Tasks;
using PlantManager.Api.Behaviour;
using PlantManager.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PlantManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommandsController : Controller
    {
        private readonly CommandsService _commandsService;

        public CommandsController(CommandsService commandsService)
        {
            _commandsService = commandsService;
        }

        public async Task<ActionResult> ExecCommand(ICommand cmd)
        {
            return await _commandsService.ExecCommand(cmd, ModelState);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreatePlant(CreatePlant cmd)
        {
            return await ExecCommand(cmd);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> UpdatePlantFractions(UpdatePlantFractions cmd)
        {
            return await ExecCommand(cmd);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> RenamePlant(RenamePlant cmd)
        {
            return await ExecCommand(cmd);
        }


        [HttpPost("[action]")]
        public async Task<ActionResult> RecordExtraction(RecordExtraction cmd)
        {
            return await ExecCommand(cmd);
        }
    }
}