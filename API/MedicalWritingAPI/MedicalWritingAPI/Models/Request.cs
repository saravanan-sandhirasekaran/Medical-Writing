namespace MedicalWritingWordAddInAPI.ViewModels
{
    public class Request
    {
        public string InitialPrompt { get; set; }
        public string OriginalContent { get; set; }
        public string Instruction { get; set; }
        public string SectionID { get; set; }
    }
}
