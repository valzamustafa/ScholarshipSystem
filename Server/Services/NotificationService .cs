using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Entities;
using Server.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotification(int userId, string message, string notificationType,
        string? relatedEntityType = null, int? relatedEntityId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
            NotificationType = notificationType,
            RelatedEntityType = relatedEntityType,
            RelatedEntityId = relatedEntityId,
            DateSent = DateTime.UtcNow,
            IsRead = false
        };

        await _context.Notification.AddAsync(notification);
        await _context.SaveChangesAsync();
    }

public async Task CreateApplicationSubmittedNotification(int studentId, int applicationId)
{
    await CreateNotification(studentId,
        "Your scholarship application was submitted successfully",
        "ApplicationSubmitted",
        "Application", applicationId);
}

    public async Task CreateApplicationAcceptedNotification(int studentId, int applicationId)
    {
        await CreateNotification(studentId,
            "Your scholarship application was accepted!",
            NotificationType.ApplicationAccepted.ToString(),
            "Application", applicationId);
    }

    public async Task CreateApplicationRejectedNotification(int studentId, int applicationId)
    {
        await CreateNotification(studentId,
            "Your scholarship application was rejected.",
            NotificationType.ApplicationRejected.ToString(),
            "Application", applicationId);
    }

    public async Task CreateApplicationStatusUpdatedNotification(int userId, int applicationId)
    {
        await CreateNotification(userId,
            "Your scholarship application status has been updated.",
            NotificationType.ApplicationStatusUpdated.ToString(),
            "Application", applicationId);
    }

    public async Task CreateDeadlineApproachingNotification(int studentId, int scholarshipId, string scholarshipTitle)
    {
        await CreateNotification(studentId,
            $"Deadline approaching for scholarship: {scholarshipTitle}",
            NotificationType.DeadlineApproaching.ToString(),
            "Scholarship", scholarshipId);
    }

    public async Task CreateNewMatchingScholarshipNotification(int studentId, int scholarshipId)
    {
        await CreateNotification(studentId,
            "A new scholarship matching your profile has been added.",
            NotificationType.NewMatchingScholarship.ToString(),
            "Scholarship", scholarshipId);
    }

   public async Task CreateNewApplicationNotification(int userId, int applicationId)
{
    var application = await _context.Application
        .Include(a => a.Student)
        .Include(a => a.Scholarship)
        .FirstOrDefaultAsync(a => a.Id == applicationId);

    string studentName = application?.Student?.FullName ?? "A student";
    string scholarshipName = application?.Scholarship?.Title ?? "a scholarship";

    await CreateNotification(userId,
        $"New application received from {studentName} for {scholarshipName}",
        "NewApplication",
        "Application", applicationId);
}

    public async Task CreateApplicationDecisionConfirmedNotification(int providerId, int applicationId)
    {
        await CreateNotification(providerId,
            "You have confirmed a decision on an application.",
            NotificationType.ApplicationDecisionConfirmed.ToString(),
            "Application", applicationId);
    }

    public async Task CreateScholarshipExpiringNotification(int providerId, int scholarshipId)
    {
        await CreateNotification(providerId,
            "A scholarship you manage is expiring soon.",
            NotificationType.ScholarshipExpiringSoon.ToString(),
            "Scholarship", scholarshipId);
    }

    public async Task CreateAdminFeedbackNotification(int userId, string message)
    {
        await CreateNotification(userId,
            message,
            NotificationType.AdminFeedback.ToString());
    }

    public async Task CreateNewScholarshipAddedNotification(int adminId, int scholarshipId)
    {
        await CreateNotification(adminId,
            "A new scholarship has been added.",
            NotificationType.NewScholarshipAdded.ToString(),
            "Scholarship", scholarshipId);
    }

    public async Task CreateNewStudentRegisteredNotification(int adminId, int studentId)
    {
        await CreateNotification(adminId,
            "A new student has registered.",
            NotificationType.NewStudentRegistered.ToString(),
            "Student", studentId);
    }

    public async Task CreateUserReportNotification(int adminId, string message)
    {
        await CreateNotification(adminId,
            message,
            NotificationType.UserReport.ToString());
    }

    public async Task CreateMonthlyStatisticsNotification(int userId)
    {
        await CreateNotification(userId,
            "Monthly statistics are now available.",
            NotificationType.MonthlyStatistics.ToString());
    }

    public async Task MarkAsRead(int notificationId)
    {
        var notification = await _context.Notification.FindAsync(notificationId);
        if (notification != null && !notification.IsRead)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<NotificationDto>> GetUserNotifications(int userId)
    {
        return await _context.Notification
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.DateSent)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                DateSent = n.DateSent,
                IsRead = n.IsRead,
                UserId = n.UserId,
                NotificationType = n.NotificationType,
                RelatedEntityType = n.RelatedEntityType,
                RelatedEntityId = n.RelatedEntityId,
                Icon = GetNotificationIcon(n.NotificationType)
            })
            .ToListAsync();
    }

    public async Task<int> GetUnreadCount(int userId)
    {
        return await _context.Notification
            .CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    private string GetNotificationIcon(string notificationType)
    {
        return notificationType switch
        {
            "ApplicationSubmitted" => "📤",
            "ApplicationAccepted" => "✅",
            "ApplicationRejected" => "❌",
            "ApplicationStatusUpdated" => "⏳",
            "DeadlineApproaching" => "📅",
            "NewMatchingScholarship" => "🆕",
            "NewApplication" => "🧑‍🎓",
            "ApplicationDecisionConfirmed" => "✅",
            "ScholarshipExpiringSoon" => "⚠️",
            "AdminFeedback" => "📝",
            "NewScholarshipAdded" => "🏆",
            "NewStudentRegistered" => "👨‍🎓",
            "UserReport" => "🚨",
            "MonthlyStatistics" => "📊",
            _ => "🔔"
        };
    }

   public async Task CheckApproachingDeadlines(AppDbContext dbContext)
{
    var approachingDeadlines = await dbContext.Scholarship
        .Where(s => s.Deadline <= DateTime.Now.AddDays(7) && s.Deadline > DateTime.Now)
        .ToListAsync();

    foreach (var scholarship in approachingDeadlines)
    {
        var interestedStudents = await dbContext.Student
            .Where(s => true) 
            .ToListAsync();

        foreach (var student in interestedStudents)
        {
            await CreateDeadlineApproachingNotification(student.Id, scholarship.Id, scholarship.Title);
        }
    }
}
   public async Task CheckExpiringScholarships(AppDbContext dbContext)
{
    var expiringScholarships = await dbContext.Scholarship
        .Where(s => s.Deadline <= DateTime.Now.AddDays(7) && s.Deadline > DateTime.Now)
        .ToListAsync();

    foreach (var scholarship in expiringScholarships)
    {
        var providerId = scholarship.ProviderId;
       if (scholarship.ProviderId.HasValue)
{
    await CreateScholarshipExpiringNotification(scholarship.ProviderId.Value, scholarship.Id);
}

    }
}
    public async Task SendMonthlyStatistics(AppDbContext dbContext)
{
  var adminUsers = await dbContext.Admin
    .ToListAsync();



    foreach (var admin in adminUsers)
    {
        await CreateMonthlyStatisticsNotification(admin.Id);
    }
}
}
