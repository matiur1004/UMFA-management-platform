using ClientPortal.Controllers.Authorization;
using DevExpress.DashboardAspNetCore;
using DevExpress.DashboardWeb;
using Microsoft.AspNetCore.DataProtection;

namespace ClientPortal.Controllers
{
    public class PortalDashboardController : DashboardController
    {
        public PortalDashboardController(DashboardConfigurator configurator, IDataProtectionProvider? dataProtectionProvider = null)
            : base(configurator, dataProtectionProvider)
        {
        }

    }
}
