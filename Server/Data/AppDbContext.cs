using Microsoft.EntityFrameworkCore;
using Server.Entities;
namespace Server.Data; 

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AcademicYear> AcademicYear { get; set; }
    public DbSet<Admin> Admin { get; set; }
    public DbSet<Application> Application { get; set; }
    public DbSet<ApplicationDocument> ApplicationDocument { get; set; }
    public DbSet<ApplicationStatus> ApplicationStatus { get; set; }
    public DbSet<AuditLog> AuditLog { get; set; }
    public DbSet<Country> Country { get; set; }
    public DbSet<EligibilityCriteria> EligibilityCriteria { get; set; }
    public DbSet<Feedback> Feedback { get; set; }
    public DbSet<Notification> Notification { get; set; }
    public DbSet<Provider> Provider { get; set; }
    public DbSet<Role> Role { get; set; }
    public DbSet<Scholarship> Scholarship { get; set; }
    public DbSet<ScholarshipAward> ScholarshipAward { get; set; }
    public DbSet<ScholarshipCategory> ScholarshipCategory { get; set; }

    public DbSet<ScholarshipType> ScholarshipType { get; set; }
    public DbSet<Student> Student { get; set; }
    public DbSet<StudentLevel> StudentLevel { get; set; }
    public DbSet<University> University { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<UserActivityLog> UserActivityLog { get; set; }

 
}