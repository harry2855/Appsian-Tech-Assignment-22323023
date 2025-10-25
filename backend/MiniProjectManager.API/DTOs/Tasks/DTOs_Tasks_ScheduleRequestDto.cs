namespace MiniProjectManager.API.DTOs.Tasks
{
    public class ScheduleRequestDto
    {
        public List<ScheduleTaskInputDto> Tasks { get; set; } = new();
    }
}
