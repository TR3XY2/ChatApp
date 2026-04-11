using ChatApp.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.API.Hubs;

public class ChatHub : Hub
{
    private readonly IChatService chatService;

    public ChatHub(IChatService chatService)
    {
        this.chatService = chatService;
    }

    public async Task SendMessage(string user, string message)
    {
        var result = await chatService.ProcessMessageAsync(user, message);

        await this.Clients.All.SendAsync("ReceiveMessage", result);
    }
}
