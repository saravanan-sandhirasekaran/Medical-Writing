using DocumentFormat.OpenXml.Packaging;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text.Json;
using System.Text;
using Azure.Core;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Components.Forms;
using System.Reflection;
using Xceed.Words.NET;
using MedicalWritingWordAddInAPI.Models;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Data.OleDb;
using System.Data;
using DocumentFormat.OpenXml;

namespace MedicalWritingAPI.Controllers
{
    [ApiController]
    [Route("api/template")]
    public class TemplateController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration; 
        private readonly HttpClient _httpClient;

        public TemplateController(IWebHostEnvironment env, IConfiguration configuration, HttpClient httpClient)
        {
            this._env = env;
            this._configuration = configuration;
            this._httpClient = httpClient;
        }

        [HttpGet("GenerateDocument")]
        public async Task<IActionResult> GenerateDocument()
        {
            var extractedPlaceHolderDatas = await FetchPlaceHolderDataFromExternal();
            var sourceFilePath = Path.Combine(_env.ContentRootPath, "Data", "CSP_Template.docx");
            // Build the full destination file path
            string destinationFilePath = Path.Combine(this._env.ContentRootPath, "Output", "csp_template_generated.docx");
            UpdatePlaceHolderFromTemplates(sourceFilePath, extractedPlaceHolderDatas, destinationFilePath);


            var scheduleOfAssessmentSourcePath = Path.Combine(_env.ContentRootPath, "ExternalData", "Schedule_of_Assessments_Input.xlsx");
            var scheduleOfAssessmentDatas = LoadScheduleFromExcelOleDb(scheduleOfAssessmentSourcePath);
            UpdateWordDocumentWithTicks(destinationFilePath, scheduleOfAssessmentDatas);

            // Read JSON file (adjust path as needed) 
            var jsonPath = Path.Combine(_env.ContentRootPath, "Data", "prompt.json");
            string jsonContent = System.IO.File.ReadAllText(jsonPath);

            // Deserialize
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            List<SectionPrompt> sections = JsonSerializer.Deserialize<List<SectionPrompt>>(jsonContent, options);
            await GenerateAndUpdateContent(sections);
            UpdateAIPromptFromTemplates(destinationFilePath, sections);
            return Ok("Success");
        }

        private async Task GenerateAndUpdateContent(List<SectionPrompt> sections)
        {
            //var agentName = _configuration["AISettings:PromptAgentName"];
            //var agentID = await GetAgentID(agentName);

            var tasks = sections.Select(async section =>
            {
                var agentID = await GetAgentID(section.AgentName);
                var generatedData = await GetExecutePromptAsync(agentID, section.Prompt);
                using var document = JsonDocument.Parse(generatedData);
                string promptResponse = document.RootElement.GetProperty("promptResponse").GetString();
                section.GeneratedContent = promptResponse;
            }).ToList();

            await Task.WhenAll(tasks);
        }

        private async Task<Dictionary<string, string>> FetchPlaceHolderDataFromExternal()
        {
            var agentName = _configuration["AISettings:AgentName"];
            var agentID = await GetAgentID(agentName);
            var protocolData = await GetExecutePromptAsync(agentID, "extract the data from the knowledge and and return the json data as {\"Protocol Title\" : \"test\", \"Protocol Number\": \"100\", \"Study Phase\" : \"test\", \"Sponsor Name\": \"test\", \"Compound\": \"test\", \"Brief Title\": \"test\", \"Legal Registered Address\": \"test\", \"Regulatory Agency Identifier Number(s)\": \"test\", \"Study Registry Number(s)\": \"test\", \"Protocol Date\": \"test\"}");

            using JsonDocument outerDoc = JsonDocument.Parse(protocolData);
            string promptResponse = outerDoc.RootElement.GetProperty("promptResponse").GetString();

            using JsonDocument innerDoc = JsonDocument.Parse(promptResponse);
            var root = innerDoc.RootElement;

            var extractedData = new Dictionary<string, string>();
            extractedData["Protocol Title"] = root.GetProperty("Protocol Title").GetString();
            extractedData["Protocol Number"] = root.GetProperty("Protocol Number").GetString();
            extractedData["Compound"] = root.GetProperty("Compound").GetString();
            extractedData["Brief Title"] = root.GetProperty("Brief Title").GetString();
            extractedData["Study Phase"] = root.GetProperty("Study Phase").GetString();
            extractedData["Sponsor Name"] = root.GetProperty("Sponsor Name").GetString();
            extractedData["Legal Registered Address"] = root.GetProperty("Legal Registered Address").GetString();
            extractedData["Regulatory Agency Identifier Number(s)"] = root.GetProperty("Regulatory Agency Identifier Number(s)").GetString();
            extractedData["Study Registry Number(s)"] = root.GetProperty("Study Registry Number(s)").GetString();
            extractedData["Protocol Date"] = root.GetProperty("Protocol Date").GetString();
            return extractedData;
        }

        private Dictionary<string, Dictionary<string, string>> LoadScheduleFromExcelOleDb(string filePath)
        {
            var result = new Dictionary<string, Dictionary<string, string>>();

            string connectionString = $@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={filePath};Extended Properties='Excel 12.0 Xml;HDR=YES;IMEX=1'";
            using (var conn = new OleDbConnection(connectionString))
            {
                conn.Open();
                var dtSheet = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                var sheetName = dtSheet.Rows[0]["TABLE_NAME"].ToString();

                var cmd = new OleDbCommand($"SELECT * FROM [{sheetName}]", conn);
                var adapter = new OleDbDataAdapter(cmd);
                var dataTable = new DataTable();
                adapter.Fill(dataTable);

                var headers = dataTable.Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToList();

                foreach (DataRow row in dataTable.Rows)
                {
                    string assessment = row[0]?.ToString().Trim();
                    if (string.IsNullOrWhiteSpace(assessment)) continue;

                    var map = new Dictionary<string, string>();
                    for (int i = 1; i < headers.Count; i++)
                    {
                        string header = headers[i];
                        string value = row[i]?.ToString().Trim().ToLower() == "yes" ? "✔️" : "";
                        map[header.Trim()] = value;
                    }

                    result[assessment] = map;
                }
            }

            return result;
        }

        static void UpdateWordDocumentWithTicks(string wordPath, Dictionary<string, Dictionary<string, string>> data)
        {
            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(wordPath, true))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;
                var table = body.Elements<Table>().Skip(4).First();

                var headerCells = table.Elements<TableRow>().First().Elements<TableCell>().ToList();
                var columnHeaders = headerCells.Select(c => c.InnerText.Trim()).ToList();

                foreach (var row in table.Elements<TableRow>().Skip(1)) // Skip header
                {
                    var cells = row.Elements<TableCell>().ToArray();
                    string assessment = cells[0].InnerText.Trim();

                    if (data.ContainsKey(assessment))
                    {
                        var tickMap = data[assessment];

                        for (int i = 1; i < cells.Length - 1 && i < columnHeaders.Count; i++) // Skip label and notes
                        {
                            string columnName = columnHeaders[i];

                            if (tickMap.TryGetValue(columnName, out string tick) && !string.IsNullOrWhiteSpace(tick))
                            {
                                // Use Unicode tick symbol explicitly
                                if (tick == "✔️") tick = "\u2714";

                                cells[i].RemoveAllChildren<Paragraph>();

                                var run = new Run(
                                    new RunProperties(
                                        new RunFonts { Ascii = "Times New Roman", HighAnsi = "Times New Roman" },
                                        new FontSize { Val = "18" }, // 9pt = 18 half-points
                                        new Color { Val = "000000" }
                                    ),
                                    new Text(tick) { Space = SpaceProcessingModeValues.Preserve }
                                );

                                cells[i].Append(new Paragraph(run));
                            }
                        }
                    }
                }

                wordDoc.MainDocumentPart.Document.Save();
            }
        }


        private void UpdatePlaceHolderFromTemplates(string sourceFilePath,Dictionary<string, string> placeholders, string destinationFilePath)
        {
            if (System.IO.File.Exists(sourceFilePath))
            {
                // Copy source file to destination
                System.IO.File.Copy(sourceFilePath, destinationFilePath, true);

                //byte[] fileBytes = System.IO.File.ReadAllBytes(sourceFilePath);
                //System.IO.File.WriteAllBytes(destinationFilePath, fileBytes);
            }

            using var doc = DocX.Load(destinationFilePath);
            foreach (var kv in placeholders)
            {
                string placeholder = $"#{kv.Key}#";
                doc.ReplaceText(placeholder, kv.Value);
            }

            doc.SaveAs(destinationFilePath);
        }

        private void UpdateAIPromptFromTemplates(string destinationPath, List<SectionPrompt> sections)
        {
            using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(destinationPath, true))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;

                var sdtElements = body.Descendants<SdtElement>().ToList();

                foreach (var section in sections) // (index, newContent)
                {
                    //if (section.Index < 0 || section.Index >= sdtElements.Count)
                    //{
                    //    Console.WriteLine($"Index {section.Index} is out of range. Skipping.");
                    //    continue;
                    //}

                    var sdt = sdtElements
                .FirstOrDefault(e => e.SdtProperties?.GetFirstChild<Tag>()?.Val?.Value == section.Id);

                    if (sdt != null)
                    {
                        // Remove existing text
                        var textElements = sdt.Descendants<Text>().ToList();
                        foreach (var text in textElements)
                        {
                            text.Text = string.Empty;
                        }

                        // Insert new content
                        var run = sdt.Descendants<Run>().FirstOrDefault();
                        if (run == null)
                        {
                            run = new Run();
                            sdt.AppendChild(run);
                        }

                        run.RemoveAllChildren<Text>(); // Clean up any lingering text nodes
                                                       //run.AppendChild(new Text(section.GeneratedContent));

                        // Handle multi-line content
                        var lines = section.GeneratedContent.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);

                        for (int i = 0; i < lines.Length; i++)
                        {
                            run.AppendChild(new Text(lines[i]));
                            if (i < lines.Length - 1)
                            {
                                run.AppendChild(new Break());
                            }
                        }
                    }
                    //Console.WriteLine($"Updated index {section.Index} with content: {section.Prompt}");
                }

                wordDoc.MainDocumentPart.Document.Save();
                //Console.WriteLine($"All updates completed and saved to '{destinationPath}'.");
            }
        }

        private async Task<string> GetExecutePromptAsync(long agentID, string prompt)
        {
            var endpoint = _configuration["AISettings:Endpoint"];

            // Build the full URL by replacing the placeholders
            string url = $"{endpoint}/ats/v1/agent/{agentID}/prompt";

            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (compatible; MyApp/1.0)");

            // Serialize requestData to JSON
            var request = new { prompt };
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            //var request = new HttpRequestMessage(HttpMethod.Post, url)
            //{
            //    Content = content
            //};

            var accessToken = await GetAccessToken();

            // Set Authorization header
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            // Make the POST request
            //var response = await _httpClient.PostAsync(url, content);
            HttpResponseMessage response = await _httpClient.PostAsync(url, content);

            // Ensure the response was successful
            response.EnsureSuccessStatusCode();

            // Read and return the response body
            return await response.Content.ReadAsStringAsync();
        }

        private async Task<string> GetAccessToken()
        {
            var endpoint = _configuration["AISettings:Endpoint"];
            var userName = _configuration["AISettings:UserName"];
            var password = _configuration["AISettings:Password"];
            //var companyID = _configuration["AISettings:CompanyID"];
            var companyID = await GetCompanyID();

            string url = $"{endpoint}/api/Auth/login";
            var request = new { userName, password, companyID };

            // Serialize the request to JSON
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Send POST request
            var response = await _httpClient.PostAsync(url, content);

            // Ensure it's successful
            response.EnsureSuccessStatusCode();

            // Read and return the response body
            var accessInfo =  await response.Content.ReadAsStringAsync();

            using JsonDocument doc = JsonDocument.Parse(accessInfo);
            string token = doc.RootElement.GetProperty("accessToken").GetString();
            return token;
        }
        private async Task<long> GetCompanyID()
        {
            var endpoint = _configuration["AISettings:Endpoint"];
            var companyName = _configuration["AISettings:CompanyName"];

            string url = $"{endpoint}/ats/v1/company";

            var response = await _httpClient.GetAsync(url);

            // Ensure it's successful
            response.EnsureSuccessStatusCode();

            // Read and return the response body
            var accessInfo = await response.Content.ReadAsStringAsync();

            var companies = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Company>>(accessInfo);
            var targetCompany = companies.FirstOrDefault(c => c.Name == companyName);

            return targetCompany != null ? targetCompany.CompanyID : 0;
        }

        private async Task<long> GetAgentID(string agentName)
        {
            var endpoint = _configuration["AISettings:Endpoint"];
            //var agentName = _configuration["AISettings:AgentName"];

            string url = $"{endpoint}/ats/v1/agent";

            var accessToken = await GetAccessToken();

            // Set Authorization header
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.GetAsync(url);

            // Ensure it's successful
            response.EnsureSuccessStatusCode();

            // Read and return the response body
            var accessInfo = await response.Content.ReadAsStringAsync();

            var agents = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Agent>>(accessInfo);
            var targetAgent = agents.FirstOrDefault(c => c.AgentName == agentName);

            return targetAgent != null ? targetAgent.AgentID : 0;
        }
    }
}
