using MiniProjectManager.API.DTOs.Tasks;

namespace MiniProjectManager.API.Services.Interfaces
{
    public interface ISchedulerService
    {
        ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request);
    }
}
