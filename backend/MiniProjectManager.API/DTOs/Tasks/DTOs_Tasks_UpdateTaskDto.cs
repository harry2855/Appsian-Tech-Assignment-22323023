using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.API.DTOs.Tasks
{
    public class UpdateTaskDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool? IsCompleted { get; set; }
    }
}
