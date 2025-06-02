using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Data;
using System;
using System.Threading;
using System.Threading.Tasks;
using Server.Services;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<NotificationBackgroundService> _logger;

    public NotificationBackgroundService(IServiceProvider services, ILogger<NotificationBackgroundService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Background Service is running.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                await notificationService.CheckApproachingDeadlines(dbContext);
                await notificationService.CheckExpiringScholarships(dbContext);

                if (DateTime.Now.Day == 1)
                {
                    await notificationService.SendMonthlyStatistics(dbContext);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in Notification Background Service.");
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }
}
