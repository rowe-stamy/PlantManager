using System;
using PlantManager.Api.Raven;
using PlantManager.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;

namespace PlantManager.Api
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _env = env;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.AddCors(opt =>
            {
                opt.AddPolicy("AllowCors", builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed(o => true);
                });
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration.GetSection("AzureAd"));

            services.AddTransient<CommandHandler>();
            services.AddTransient<CommandsService>();
            services.AddSingleton<IClock, Clock>();
            services.AddScoped<IState>(CreateState);
            services.AddSingleton<RavenDocumentStoreHolder>();
            services.AddSingleton<RavenConnectionService>();

            services.AddSingleton(builder =>
                Configuration.GetAppConfiguration(_env.EnvironmentName.ToLowerInvariant(),
                    _env.IsDevelopment()
                        ? InfrastructurePlatform.LOCAL
                        : InfrastructurePlatform.GCP));

            // http context
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentRequest, CurrentRequest>();
            services.AddControllers().AddNewtonsoftJson();

            // https
            services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
                options.HttpsPort = 5000;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseHttpsRedirection();
            }

            app.ApplicationServices.GetRequiredService<RavenConnectionService>().CreateConnection();

            app.UseRouting();
            app.UseCors("AllowCors");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

        private State CreateState(IServiceProvider serviceProvider)
        {
            var storeHolder = serviceProvider.GetRequiredService<RavenDocumentStoreHolder>();
            var store = storeHolder.Store;
            var session = store.OpenAsyncSession();
            var currentRequest = serviceProvider.GetRequiredService<ICurrentRequest>();
            return new State(session, currentRequest, serviceProvider.GetRequiredService<IClock>());
        }
    }
}