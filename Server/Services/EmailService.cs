using Server.Services;
using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

public async Task SendEmailAsync(string to, string subject, string body)
{
    try
    {
        var smtpHost = _configuration["Email:SmtpHost"] ?? throw new Exception("SMTP Host not configured");
        if (!int.TryParse(_configuration["Email:SmtpPort"], out int smtpPort))
            throw new Exception("Invalid SMTP port configuration");
        
        var smtpUsername = _configuration["Email:SmtpUsername"] ?? throw new Exception("SMTP Username not configured");
        var smtpPassword = _configuration["Email:SmtpPassword"] ?? throw new Exception("SMTP Password not configured");
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@yourdomain.com";

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUsername, smtpPassword),
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            Timeout = 10000 // 10 seconds
        };

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(fromAddress),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        mailMessage.To.Add(to);

        await client.SendMailAsync(mailMessage);
    }
    catch (SmtpException smtpEx)
    {
        throw new Exception($"SMTP Error: {smtpEx.StatusCode} - {smtpEx.Message}", smtpEx);
    }
    catch (Exception ex)
    {
        throw new Exception($"Email sending failed: {ex.Message}", ex);
    }
}
}