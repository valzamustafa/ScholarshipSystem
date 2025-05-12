namespace Server.Entities;

public class Country
{
    public int CountryId { get; set; }
    public required string Name { get; set; }

    public ICollection<Provider> Provider { get; set; }=new List<Provider>();
}