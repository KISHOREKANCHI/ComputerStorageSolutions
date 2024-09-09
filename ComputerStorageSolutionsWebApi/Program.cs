using ComputerStorageSolutions.Controllers;
using ComputerStorageSolutions.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure database context
builder.Services.AddDbContext<DataBaseConnect>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("Logs/ComputerStorageSolutions.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

// Configure authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});
builder.Services.AddSingleton<IJwtCreationService, JwtCreationService>();


// Configure authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(SecurityPolicy.User, SecurityPolicy.UserPolicy());
    options.AddPolicy(SecurityPolicy.Admin, SecurityPolicy.AdminPolicy());
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 2 * 1024 * 1024; // 2 MB for file uploads
    options.ValueLengthLimit = 16 * 1024 * 1024; // 16 MB for form field values
    options.MultipartBoundaryLengthLimit = 128; // Boundary size
    options.MemoryBufferThreshold = 128 * 1024; // 128 KB before switching to disk
    options.BufferBodyLengthLimit = 2 * 1024 * 1024; // 2 MB for buffering
    options.KeyLengthLimit = 256; // Maximum form field key length
}

);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<IJwtService, TokenService>(); // Register TokenService
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Host.UseSerilog();

var app = builder.Build();
app.UseSerilogRequestLogging();

// Configure middleware
app.UseStaticFiles();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseHsts();
app.UseAuthorization();

app.MapControllers();

app.Run();