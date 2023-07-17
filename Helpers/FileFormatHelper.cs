using ClientPortal.Models.ResponseModels;
using System.Globalization;

namespace ClientPortal.Helpers
{
    public static class FileFormatHelper
    {
        public static string TranslateFileFormat(string fileFormat, FileFormatData data)
        {
            // Perform the translations for each placeholder and replacement
            fileFormat = fileFormat.Replace("{PNAME}", data.PeriodName)
                .Replace("{PMM}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).ToString("MM"))
                .Replace("{PMMMM}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).ToString("MMMM"))
                .Replace("{PM3}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).ToString("MMM"))
                .Replace("{PMM+1}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).AddMonths(1).ToString("MM"))
                .Replace("{PMMMM+1}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).AddMonths(1).ToString("MMMM"))
                .Replace("{PM3+1}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).AddMonths(1).ToString("MMM"))
                .Replace("{PYY}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).ToString("yy"))
                .Replace("{PYYYY}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).ToString("yyyy"))
                .Replace("{PYY+1}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).AddYears(1).ToString("yy"))
                .Replace("{PYYYY+1}", DateTime.ParseExact(data.PeriodName, "MMMM yyyy", CultureInfo.InvariantCulture).AddYears(1).ToString("yyyy"))
                .Replace("{TN}", data.TenantName)
                .Replace("{TEC}", data.TenantExportCode)
                .Replace("{SEC}", data.ShopExportCode)
                .Replace("{ACC}", data.AccountNr)
                .Replace("{PEPC}", data.PrimaryExportCode)
                .Replace("{SEPC}", data.SecondaryExportCode)
                .Replace("{BC}", data.BuildingCode)
                .Replace("{BSC}", data.ShopBuildingExportCode)
                .Replace("{SNR}", data.ShopNr)
                .Replace("{BN}", data.BuildingName);

            // Clean up the filename
            string cleanedFilename = CleanFilename(fileFormat);

            return cleanedFilename;
        }

        private static string CleanFilename(string filename)
        {
            // Remove invalid characters from the filename
            string invalidChars = new string(Path.GetInvalidFileNameChars()) + new string(Path.GetInvalidPathChars());
            foreach (char c in invalidChars)
            {
                filename = filename.Replace(c.ToString(), "");
            }

            return filename;
        }
    }
}
