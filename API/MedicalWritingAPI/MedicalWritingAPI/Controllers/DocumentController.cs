using Microsoft.AspNetCore.Mvc;

namespace MedicalWritingAPI.Controllers
{
    [ApiController]
    [Route("api/document")]
    public class DocumentController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public DocumentController(IWebHostEnvironment env)
        {
            this._env = env;
        }

        [HttpGet("DownloadTemplate/{documentType}")]
        public IActionResult DownloadTemplate(string documentType)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Data", documentType == "CSR" ? "CSR_Template.docx": "CSP_Template.docx"); // Or your server location

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            var fileName = documentType == "CSR" ? "csr_template.docx" : "csp_template.docx";

            return File(stream, contentType, fileName);
        }

        //To be removed
        [HttpGet("DownloadDocument")]
        public IActionResult DownloadDocument()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Output", "csp_template_generated.docx"); // Or your server location

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            var fileName = "csp_document_generated.docx";

            return File(stream, contentType, fileName);
        }

        [HttpGet("DownloadDocumentUrl")]
        public IActionResult DownloadDocumentUrl()
        {
            var fileName = "csp_template_generated.docx"; // Actual file
            var filePath = Path.Combine(_env.ContentRootPath, "Output", fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            // This URL must point to a static file-serving route. Adjust as needed.
            var publicUrl = $"{Request.Scheme}://{Request.Host}/files/{fileName}";

            return Ok(publicUrl); // Respond with the public URL as plain text
        }
    }
}
