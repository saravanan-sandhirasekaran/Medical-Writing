namespace MedicalWritingWordAddInAPI.Models
{
    public class SectionPrompt
    {
        public string Title { get; set; }
        public string Id { get; set; }
        public string Prompt { get; set; }
        public string GeneratedContent { get; set; }
        public string AgentName { get; set; }
    }
}
