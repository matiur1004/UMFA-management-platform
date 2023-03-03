using DevExpress.AspNetCore.Reporting;
using DevExpress.AspNetCore;
using DevExpress.XtraReports.Services;
using Microsoft.Extensions.FileProviders;
using System.Reflection;
using ClientPortal.Data;
using ClientPortal.Helpers;
using ClientPortal.Services;
using Serilog;
using System.Text.Json.Serialization;
using ClientPortal.Data.Repositories;
using Microsoft.OpenApi.Models;
using DevExpress.Security.Resources;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

//local variables
IFileProvider? fileProvider = builder.Environment.ContentRootFileProvider;
IConfiguration? configuration = builder.Configuration;


// Add services to the container.
{

    var services = builder.Services;
    var env = builder.Environment;

    //logging
    var logger = new LoggerConfiguration()
      .ReadFrom.Configuration(builder.Configuration)
      .Enrich.FromLogContext()
      .CreateLogger();
    builder.Logging.ClearProviders();
    builder.Logging.AddSerilog(logger);

    //strongly typed configuration settings
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

    services.AddControllers();
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Version = "v1",
            Title = "UMFA Client Portal",
            Description = "Web API Endpoints for UMFA's Client Portal",
            TermsOfService = new Uri("https://example.com/terms"),
            Contact = new OpenApiContact
            {
                Name = "Example Contact",
                Url = new Uri("https://example.com/contact")
            },
            License = new OpenApiLicense
            {
                Name = "Example License",
                Url = new Uri("https://example.com/license")
            }
        });
        c.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme."
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
            },
            new string[] {}
        }
    });

        // using System.Reflection;
        //var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        //options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    });

    //DevExpress
    services.AddDevExpressControls();
    services.AddScoped<IReportProviderAsync, CustomReportProvider>();
    services.ConfigureReportingServices(configurator =>
    {
        configurator.ConfigureReportDesigner(designerConfigurator =>
        {
        });
        configurator.ConfigureWebDocumentViewer(viewerConfigurator =>
        {
            viewerConfigurator.UseCachedReportSourceBuilder();
            //viewerConfigurator.RegisterConnectionProviderFactory<CustomSqlDataConnectionProviderFactory>();
        });
        configurator.UseAsyncEngine();
    });

    services.AddAutoMapper(Assembly.GetExecutingAssembly());

    var APIconnectionString = builder.Configuration.GetConnectionString("APIDb");
    services.AddDbContext<PortalDBContext>(x => x.UseSqlServer(APIconnectionString));

    var UmfaConnectionString = builder.Configuration.GetConnectionString("UmfaDb");
    services.AddDbContext<UmfaDBContext>(x => x.UseSqlServer(UmfaConnectionString));

    services.AddControllersWithViews()
        .AddJsonOptions(x => x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)
        .AddJsonOptions(x => x.JsonSerializerOptions.PropertyNamingPolicy = null)
        .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

    services.AddHttpClient();

    //API services DI
    services.AddScoped<IJwtUtils, JwtUtils>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IExternalCalls, ExternalCalls>();
    services.AddScoped<IHomeService, HomeService>();
    services.AddScoped<IAMRMeterService, AMRMeterService>();
    services.AddScoped<IBuildingService, BuildingService>();
    services.AddScoped<IAMRScadaUserService, AMRScadaUserService>();
    services.AddScoped<IAMRDataService, AMRDataService>();
    services.AddScoped<BuildingRecoveryReportService>();
    services.AddTransient<IScadaCalls, ScadaCalls>();
    services.AddScoped<DashboardService, DashboardService>();
    services.AddScoped<MappedMetersService, MappedMetersService>();

        //Data components
    services.AddScoped<IPortalStatsRepository, PortalStatsRepository>();
    services.AddScoped<IAMRMeterRepository, AMRMeterRepository>();
    services.AddScoped<IUMFABuildingRepository, UMFABuildingRepository>();
    services.AddScoped<IAMRScadaUserRepository, AMRScadaUserRepository>();
    services.AddScoped<IAMRDataRepository, AMRDataRepository>();
    services.AddScoped<IReportRepository, ReportRepository>();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
{
    if (!app.Environment.IsDevelopment())
    {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    } else
    {
    }
    
    

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();
    app.MapControllers();

    var contentDirectoryAllowRule = DirectoryAccessRule.Allow(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "..", "Content")).FullName);
    AccessSettings.ReportingSpecificResources.TrySetRules(contentDirectoryAllowRule, UrlAccessRule.Allow());
    DevExpress.XtraReports.Configuration.Settings.Default.UserDesignerOptions.DataBindingMode = DevExpress.XtraReports.UI.DataBindingMode.ExpressionsAdvanced;

    app.UseDevExpressControls();

    //add custom jwt auth middleware
    app.UseMiddleware<JwtMiddleWare>();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    app.MapFallbackToFile("index.html");

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger(options =>
        {
            options.SerializeAsV2 = true;
        });
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Umfa Client Portal WebApi v1"));
    }

}

//Inject configuration options into static class used for encryption
CryptoUtils.CryptoConfigure(app.Services.GetService<IOptions<AppSettings>>());

app.Run();
