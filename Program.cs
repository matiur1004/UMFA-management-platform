using DevExpress.AspNetCore.Reporting;
using DevExpress.AspNetCore;
using DevExpress.DashboardWeb;
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
using DevExpress.DashboardAspNetCore;
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
    services.AddScoped<DashboardConfigurator>((IServiceProvider serviceProvider) =>
    {
        return DashboardUtils.CreateDashboardConfigurator(configuration, fileProvider);
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
    services.AddScoped<IReportRepository, ReportRepository>();
    services.AddScoped<BuildingRecoveryReportService>();
    services.AddTransient<IScadaCalls, ScadaCalls>();

        //Data components
    services.AddScoped<IPortalStatsRepository, PortalStatsRepository>();
    services.AddScoped<IAMRMeterRepository, AMRMeterRepository>();
    services.AddScoped<IUMFABuildingRepository, UMFABuildingRepository>();
    services.AddScoped<IAMRScadaUserRepository, AMRScadaUserRepository>();
    services.AddScoped<IAMRDataRepository, AMRDataRepository>();

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

    var contentDirectoryAllowRule = DirectoryAccessRule.Allow(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "..", "Content")).FullName);
    AccessSettings.ReportingSpecificResources.TrySetRules(contentDirectoryAllowRule, UrlAccessRule.Allow());
    DevExpress.XtraReports.Configuration.Settings.Default.UserDesignerOptions.DataBindingMode = DevExpress.XtraReports.UI.DataBindingMode.ExpressionsAdvanced;

    app.UseDevExpressControls();

    // Maps the dashboard route.
    EndpointRouteBuilderExtension.MapDashboardRoute(app, "/dashboard", "PortalDashboard");

    //add custom jwt auth middleware
    app.UseMiddleware<JwtMiddleWare>();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    app.MapFallbackToFile("index.html"); ;
}

//Inject configuration options into static class used for encryption
CryptoUtils.CryptoConfigure(app.Services.GetService<IOptions<AppSettings>>());

app.Run();
