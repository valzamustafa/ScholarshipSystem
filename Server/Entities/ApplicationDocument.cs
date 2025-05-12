namespace Server.Entities;
public class ApplicationDocument
{
    public int Id { get; set; }
    
    public required  string FileName { get; set; }
    public required string FilePath { get; set; }
    public int ApplicationId { get; set; }
    public Application Application { get; set; }=null!;
}