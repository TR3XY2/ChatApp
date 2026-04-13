using Azure;
using Azure.AI.TextAnalytics;
using ChatApp.API.Hubs;
using ChatApp.Application.Interfaces;
using ChatApp.Application.Services;
using ChatApp.Infrastructure.Persistence;
using ChatApp.Infrastructure.Repositories;
using Microsoft.Azure.SignalR;
using Microsoft.EntityFrameworkCore;
using System;

var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IChatService, ChatService>();

builder.Services.AddSignalR()
    .AddAzureSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins(
                "https://witty-glacier-0a0c95903.7.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSingleton(new TextAnalyticsClient(
    new Uri(builder.Configuration["AzureAI:Endpoint"]!),
    new AzureKeyCredential(builder.Configuration["AzureAI:Key"]!)
));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseWebSockets();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chat");

await app.RunAsync();
