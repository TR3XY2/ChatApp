using ChatApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.Interfaces;

public interface IChatService
{
    Task<ChatMessageDto> ProcessMessageAsync(string user, string text);

    Task<List<ChatMessageDto>> GetMessagesAsync();
}
