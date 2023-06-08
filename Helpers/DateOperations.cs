namespace ClientPortal.Helpers
{
    public static class DateOperations
    {
        public static DateTime FirstDayOfPreviousMonth(DateTime now)
        {
            return now.AddMonths(-1).AddDays(-now.Day + 1);
        }
    }
}
