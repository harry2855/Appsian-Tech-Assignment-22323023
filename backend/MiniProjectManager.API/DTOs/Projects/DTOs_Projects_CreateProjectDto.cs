using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.API.DTOs.Projects
{
    public class CreateProjectDto
    {
        [Required]
        [StringLength(10, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [StringLength(90)]
        public string? Description { get; set; }
    }
}
