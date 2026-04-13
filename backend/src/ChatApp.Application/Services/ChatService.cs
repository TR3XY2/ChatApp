using Azure.AI.TextAnalytics;
using ChatApp.Application.DTOs;
using ChatApp.Application.Interfaces;
using ChatApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.Services;

public class ChatService : IChatService
{
    private readonly IMessageRepository messageRepository;
    private readonly TextAnalyticsClient _textAnalytics;

    public ChatService(IMessageRepository messageRepository, TextAnalyticsClient textAnalytics)
    {
        this.messageRepository = messageRepository;
        _textAnalytics = textAnalytics;
    }

    public async Task<ChatMessageDto> ProcessMessageAsync(string user, string text)
    {
        var response = await _textAnalytics.AnalyzeSentimentAsync(text);

        var sentiment = response.Value.Sentiment.ToString();

        var message = new Message
        {
            User = user,
            Text = text,
            Sentiment = sentiment,
            CreatedAt = DateTime.UtcNow
        };

        await messageRepository.AddAsync(message);

        return new ChatMessageDto
        {
            User = message.User,
            Text = message.Text,
            Sentiment = sentiment,
            CreatedAt = message.CreatedAt
        };
    }

    public async Task<List<ChatMessageDto>> GetMessagesAsync()
    {
        var messages = await messageRepository.GetAllAsync();

        return messages.Select(m => new ChatMessageDto
        {
            User = m.User,
            Text = m.Text,
            CreatedAt = m.CreatedAt,
            Sentiment = m.Sentiment
        }).ToList();
    }
}
