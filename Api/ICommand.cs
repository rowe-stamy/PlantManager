using System.Threading.Tasks;

namespace PlantManager.Api
{
    public interface ICommand
    {
        Task HandleAsync(IState state);

        virtual async Task CheckPermissions(IState state)
        {
            await Task.CompletedTask;
        }

    }
}