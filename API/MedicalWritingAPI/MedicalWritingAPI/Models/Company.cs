namespace MedicalWritingWordAddInAPI.Models
{
    public class Company
    {
        public long CompanyID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string AuthenticationType { get; set; }
        public string AdminEmailID { get; set; }
        public int AI_ProviderID { get; set; }
        public bool IsAdmin { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedDateTime { get; set; }
        public string ModifiedBy { get; set; }
        public bool isActive { get; set; }
    }
}
