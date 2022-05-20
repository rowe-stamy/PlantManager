using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PlantManager.Api.Services
{
    public class CommandHandler
    {
        private readonly IState _state;

        public CommandHandler(IState state)
        {
            _state = state;
        }

        public async Task<Dictionary<string, List<object>>> ExecAsync(ICommand cmd)
        {
            try
            {
                await cmd.CheckPermissions(_state);
                await cmd.HandleAsync(_state);
                return await _state.SaveChangesAsync();
            }
            catch (BusinessException e)
            {
                await _state.AddAsync(new BusinessError
                {
                    Id = Guid.NewGuid().ToString(),
                    Message = e.Message,
                    CallStack = new List<ICommand>
                    {
                        cmd
                    }
                });
                await _state.SaveChangesAsync();
                throw;
            }
            catch (NullReferenceException e)
            {
                await _state.AddAsync(new NullPointerExceptionLog
                {
                    Id = Guid.NewGuid().ToString(),
                    StackTrace = e.StackTrace
                });
                await _state.SaveChangesAsync();
                throw;
            }
        }
    }
}