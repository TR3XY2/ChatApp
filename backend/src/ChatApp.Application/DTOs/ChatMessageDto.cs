using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs;

public class ChatMessageDto
{
    public required string User { get; set; }
    public required string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Sentiment { get; set; }
}
