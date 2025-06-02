using System.Collections.Generic;
using System.Threading.Tasks;
using Server.Data;
using Server.Dtos;
using Server.Entities;

namespace Server.Services
{
    public interface INotificationService
{
    Task CreateNotification(int userId, string message, string notificationType, 
        string? relatedEntityType = null, int? relatedEntityId = null);
    
   
    Task CreateApplicationSubmittedNotification(int studentId, int applicationId);
    Task CreateApplicationAcceptedNotification(int studentId, int applicationId);
    Task CreateApplicationRejectedNotification(int studentId, int applicationId);
    Task CreateApplicationStatusUpdatedNotification(int userId, int applicationId);
    Task CreateDeadlineApproachingNotification(int studentId, int scholarshipId, string scholarshipTitle);
    Task CreateNewMatchingScholarshipNotification(int studentId, int scholarshipId);
    Task CreateNewApplicationNotification(int providerId, int applicationId);
    Task CreateApplicationDecisionConfirmedNotification(int providerId, int applicationId);
    Task CreateScholarshipExpiringNotification(int providerId, int scholarshipId);
    Task CreateAdminFeedbackNotification(int userId, string message);
    Task CreateNewScholarshipAddedNotification(int adminId, int scholarshipId);
    Task CreateNewStudentRegisteredNotification(int adminId, int studentId);
    Task CreateUserReportNotification(int adminId, string message);
    Task CreateMonthlyStatisticsNotification(int userId);
 Task CheckApproachingDeadlines(AppDbContext dbContext);
    Task CheckExpiringScholarships(AppDbContext dbContext);
    Task SendMonthlyStatistics(AppDbContext dbContext);
    Task MarkAsRead(int notificationId);
    Task<IEnumerable<NotificationDto>> GetUserNotifications(int userId);
    Task<int> GetUnreadCount(int userId);
}
}