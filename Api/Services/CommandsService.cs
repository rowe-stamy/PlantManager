using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using Raven.Client.Exceptions;
using Raven.Client.Exceptions.Database;

namespace PlantManager.Api.Services
{
    public class CommandsService
    {
        private readonly ILogger<CommandsService> _logger;
        private readonly CommandHandler _commandHandler;

        public CommandsService(ILogger<CommandsService> logger, CommandHandler commandHandler)
        {
            _logger = logger;
            _commandHandler = commandHandler;
        }

        public async Task<ActionResult> ExecCommand(ICommand cmd, ModelStateDictionary modelState)
        {
            if (!modelState.IsValid)
            {
                return new BadRequestObjectResult(string.Join(",",
                    modelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
            }

            try
            {
                var count = 0;
                while (count < 3)
                {
                    try
                    {
                        return new OkObjectResult(await _commandHandler.ExecAsync(cmd));
                    }
                    catch (ConcurrencyException e)
                    {
                        count++;
                        _logger.LogError(e, "retry after: {count}", count);
                        await Task.Delay(TimeSpan.FromSeconds(1));
                    }
                }

                _logger.LogError("failed to handle event after retries");
                return new BadRequestObjectResult(
                    "Sorry something went wrong :( Our support team was notified and will take care of the issue asap. Please try again later.");
            }
            catch (DatabaseDoesNotExistException)
            {
                return new BadRequestObjectResult("tenant not found");
            }
            catch (BusinessException e)
            {
                return new BadRequestObjectResult(e.Message);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "technical error command");
                return new BadRequestObjectResult(
                    "Sorry something went wrong :( Our support team was notified and will take care of the issue asap. Please try again later.");
            }
        }
    }
}