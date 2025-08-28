using MedicalWritingWordAddInAPI.Models;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var openAIChatSettings = builder.Configuration.GetSection(nameof(AzureOpenAIChatSettings)).Get<AzureOpenAIChatSettings>();
builder.Services.AddSingleton(openAIChatSettings);

var aiSettings = builder.Configuration.GetSection(nameof(AISettings)).Get<AISettings>();
builder.Services.AddSingleton(aiSettings);

builder.Services.AddHttpClient();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files from wwwroot (default)
app.UseStaticFiles();

// Add support to serve files from "Output" folder under your project directory
var outputFolder = Path.Combine(app.Environment.ContentRootPath, "Output");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(outputFolder),
    RequestPath = "/files"
});

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
