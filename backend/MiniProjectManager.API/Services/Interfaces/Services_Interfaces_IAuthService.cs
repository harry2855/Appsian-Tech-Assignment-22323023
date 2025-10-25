using MiniProjectManager.API.DTOs.Auth;

namespace MiniProjectManager.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> Register(RegisterDto registerDto);
        Task<AuthResponseDto> Login(LoginDto loginDto);
        string GenerateJwtToken(Guid userId, string username);
    }
}
