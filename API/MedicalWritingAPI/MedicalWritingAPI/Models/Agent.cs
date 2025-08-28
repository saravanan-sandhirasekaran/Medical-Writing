namespace MedicalWritingWordAddInAPI.Models
{
    public class Agent
    {
        public long AgentID { get; set; }
        public string AgentName { get; set; }
        public string Description { get; set; }
        public string Role { get; set; }
        public string Instructions { get; set; }
        public string Examples { get; set; }
        public string Tool { get; set; }
        public string ToolDescription { get; set; }
        public string OutputFormat { get; set; }
        public string ProviderName { get; set; }
        public string LlmModel { get; set; }
        public int KnowledgeBaseID { get; set; }
    }

}
