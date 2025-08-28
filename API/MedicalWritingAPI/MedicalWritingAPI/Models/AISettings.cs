namespace MedicalWritingWordAddInAPI.Models
{
    public class AISettings
    {
        public string Endpoint { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string CompanyID { get; set; }
        public long AgentID { get; set; }
        public long PromptAgentID { get; set; }
    }
}
