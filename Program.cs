using ClientPortal.Data;
using ClientPortal.Data.Entities.PortalEntities;
using ClientPortal.Data.Repositories;
using ClientPortal.Helpers;
using ClientPortal.Interfaces;
using ClientPortal.Services;
using ClientPortal.Settings;
using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using DevExpress.AspNetCore.Reporting.Logging;
using DevExpress.Security.Resources;
using DevExpress.XtraReports.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Globalization;
using System.Reflection;
using System.Text.Json.Serialization;

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

    //this for devexpress logging
    services.Configure<LoggerOptions>(logOptions =>
    {
        logOptions.LogMachineName = true;
        logOptions.Prefix = "START: ";
        logOptions.LogTimeStamp = true;
        logOptions.Suffix = " :END";
    });

    //strongly typed configuration settings
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

    services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
    services.Configure<WhatsAppSettings>(builder.Configuration.GetSection(nameof(WhatsAppSettings)));
    services.Configure<TelegramSettings>(builder.Configuration.GetSection(nameof(TelegramSettings)));
    services.Configure<NotificationSettings>(builder.Configuration.GetSection(nameof(NotificationSettings)));
    //services.Configure<ArchivesQueueSettings>(builder.Configuration.GetSection(nameof(ArchivesQueueSettings)));
    services.Configure<ArchivesQueueSettings>(builder.Configuration.GetSection("ArchivesQueueSettings"));
    services.Configure<UmfaApiSettings>(builder.Configuration.GetSection(nameof(UmfaApiSettings)));

    services.AddMvcCore();
    services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
    services.AddSwaggerGen(c => {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "UMFA Client Portal API",
            Version = "v1"
        });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
        c.DescribeAllParametersInCamelCase();
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

    var DunamisConnectionString = builder.Configuration.GetConnectionString("DunamisDb");
    services.AddDbContext<DunamisDBContext>(x => x.UseSqlServer(DunamisConnectionString));

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
    services.AddScoped<IMappedMeterService, MappedMetersService>();
    services.AddTransient<IMailService, MailService>();
    services.AddTransient<IWhatsAppService, WhatsAppService>();
    services.AddTransient<ITelegramService, TelegramService>();
    services.AddTransient<INotificationService, NotificationService>();
    services.AddScoped<IScadaRequestService, ScadaRequestService>();
    services.AddScoped<IAMRMeterTriggeredAlarmService, AMRMeterTriggeredAlarmService>();
    services.AddScoped<IUmfaService, UmfaApiHttpService>();
    services.AddSingleton<IQueueService, ArchivesQueueService>();
    services.AddScoped<IArchivesService, ArchivesService>();

    //Data components
    services.AddScoped<IPortalStatsRepository, PortalStatsRepository>();
    services.AddScoped<IAMRMeterRepository, AMRMeterRepository>();
    services.AddScoped<IUMFABuildingRepository, UMFABuildingRepository>();
    services.AddScoped<IAMRScadaUserRepository, AMRScadaUserRepository>();
    services.AddScoped<IAMRDataRepository, AMRDataRepository>();
    services.AddScoped<IMappedMeterRepository, MappedMeterRepository>();
    services.AddScoped<IScadaRequestRepository<ScadaRequestHeader>, ScadaRequestHeaderRepository>();
    services.AddScoped<IScadaRequestRepository<ScadaRequestDetail>, ScadaRequestDetailRepository>();
    services.AddScoped<INotificationRepository, NotificationRepository>();
    services.AddScoped<IAMRMeterTriggeredAlarmRepository, AMRMeterTriggeredAlarmRepository>();
    services.AddScoped<IArchiveRequestDetailRepository, ArchiveRequestDetailRepository>();
    services.AddScoped<IArchiveRequestHeaderRepository, ArchiveRequestHeaderRepository>();
    services.AddScoped<IArchivedReportsRepository, ArchivedReportsRepository>();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
{
    if (!app.Environment.IsDevelopment())
    {
        // DevExpress.Drawing.Internal.DXDrawingEngine.ForceSkia();
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }
    else
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.Use(async (context, next) =>
    {
        CultureInfo cultureInfo = new CultureInfo("en-ZA");
        CultureInfo.CurrentCulture = cultureInfo;
        CultureInfo.CurrentUICulture = cultureInfo;

        await next();
    });

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseRouting();

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

}

//Inject configuration options into static class used for encryption
CryptoUtils.CryptoConfigure(app.Services.GetService<IOptions<AppSettings>>());

app.Run();
