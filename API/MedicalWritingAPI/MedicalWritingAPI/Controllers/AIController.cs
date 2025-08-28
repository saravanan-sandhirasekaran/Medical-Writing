using Azure;
using Azure.AI.OpenAI;
using MedicalWritingWordAddInAPI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using Microsoft.Extensions.Logging;
using System.Diagnostics.Eventing.Reader;
using System;
using MedicalWritingWordAddInAPI.Models;
//using Newtonsoft.Json;


namespace MedicalWritingAPI.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly OpenAIClient _client;
        private readonly string _deploymentName = "gpt-4o-mini"; // Your Azure deployment name
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IWebHostEnvironment _env;

        public AiController(IConfiguration configuration, HttpClient httpClient, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            var endpoint = _configuration["AzureOpenAIChatSettings:Endpoint"];
            var key = _configuration["AzureOpenAIChatSettings:OpenAiApiKey"];
            _client = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));
            _env = env;
        }

        [HttpPost("modify")]
        public async Task<IActionResult> ModifyText([FromBody] Request request)
        {
            if (string.IsNullOrWhiteSpace(request.InitialPrompt))
                return BadRequest("InitialPrompt and Instruction are required.");
            if (string.IsNullOrWhiteSpace(request.SectionID))
                return BadRequest("SectionID is required.");

            string context = !string.IsNullOrWhiteSpace(request.OriginalContent)
                ? $"Document data:\n{request.OriginalContent}"
                : "No prior content. Please generate new content using the instruction.";

            string userPrompt = $"""
                You are an assistant for document section editing. You provide only the content no document title only the section heading and its contents.

                {context}

                Instruction: {(string.IsNullOrWhiteSpace(request.OriginalContent) ? request.InitialPrompt.ToString() : request.Instruction)}

                Answer:
            """;

            try
            {
                var response = await _client.GetChatCompletionsAsync(_deploymentName, new ChatCompletionsOptions
                {
                    Messages =
                    {
                        new ChatMessage(ChatRole.System, "You are an assistant for document section editing. "),
                        new ChatMessage(ChatRole.User, userPrompt + "Provide the content in a well structured document format with proper styles and usage, dont provide the content like \\n * ## and other unwanted symbols in the document.")
                    },
                    MaxTokens = 3000,
                    Temperature = 0.5f
                });
                var reply = response.Value.Choices[0].Message.Content.ToString();

                return Ok(reply);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"OpenAI error: {ex.Message}");
            }
        }

        [HttpPost("SearchPrompt")]
        public async Task<IActionResult> SearchPrompt([FromBody] Request request)
        {
            string prompt = request.Instruction;
            var agentName = GetAgentNameBySectionID(request.SectionID);
            var agentID = await GetAgentID(agentName);
            var generatedData = await GetExecutePromptAsync(agentID, prompt);
            using var document = JsonDocument.Parse(generatedData);
            string promptResponse = document.RootElement.GetProperty("promptResponse").GetString();
            string promptResponse2 = document.RootElement.GetProperty("promptResponse").GetString();
            //compare promptResponse and promptResponse2 using newly created Agent
            // 
            return Ok(promptResponse);
        } 
        private string GetAgentNameBySectionID(string sectionID)
        {
            // Read JSON file (adjust path as needed) 
            var jsonPath = Path.Combine(_env.ContentRootPath, "Data", "prompt.json");
            string jsonContent = System.IO.File.ReadAllText(jsonPath);

            // Deserialize
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var agentName = _configuration["AISettings:PromptAgentName"];
            List<SectionPrompt> sections = JsonSerializer.Deserialize<List<SectionPrompt>>(jsonContent, options);
            var section = sections?.FirstOrDefault(item=> item.Id == sectionID);
            return section != null ? section.AgentName : agentName;
        }

        private async Task<string> GetExecutePromptAsync(long agentID, string prompt)
        {
            var endpoint = _configuration["AISettings:Endpoint"];

            // Build the full URL by replacing the placeholders
            string url = $"{endpoint}/ats/v1/agent/{agentID}/prompt";

            _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (compatible; MyApp/1.0)");


            var request = new { prompt };

            // Serialize the request to JSON
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            //// Serialize requestData to JSON
            //var json = JsonSerializer.Serialize(prompt);
            //var content = new StringContent(json, Encoding.UTF8, "application/json");
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
            var accessInfo = await response.Content.ReadAsStringAsync();

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

        //Medical Writing for easy prompt
        //Prompt for all protocol data
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


