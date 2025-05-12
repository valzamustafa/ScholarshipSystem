namespace Server.Entities;
public class EligibilityCriteria
{
    public int EligibilityCriteriaId { get; set; }
    public required string CriteriaDescription { get; set; }
    
    public ICollection<Scholarship> Scholarship { get; set; }= new List<Scholarship>();
}