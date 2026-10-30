using System.Globalization;

namespace AnniversaryofLove.Models
{
    public class AnniversaryViewModel
    {
        private static readonly string[] ThaiMonths =
        {
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        };

        public AnniversaryViewModel(AnniversaryOptions options, DateTimeOffset utcNow)
        {
            Options = options;

            // คิดเวลาตาม timezone ของวันเริ่มคบ ไม่ขึ้นกับ timezone ของ server
            var now = utcNow.ToOffset(options.StartDate.Offset);

            var years = 0;
            while (AnniversaryOf(years + 1) <= now)
            {
                years++;
            }

            YearsTogether = years;
            LastAnniversary = AnniversaryOf(years);
            NextAnniversary = AnniversaryOf(years + 1);
            DaysTogether = Math.Max(0, (int)Math.Floor((now - options.StartDate).TotalDays));
            IsCelebrating = years > 0 && now - LastAnniversary < TimeSpan.FromDays(1);

            var timeLeft = NextAnniversary - now;
            if (timeLeft < TimeSpan.Zero)
            {
                timeLeft = TimeSpan.Zero;
            }
            TimeLeft = timeLeft;
        }

        public AnniversaryOptions Options { get; }

        public int YearsTogether { get; }

        public int NextYear => YearsTogether + 1;

        public int DaysTogether { get; }

        public string DaysTogetherText => DaysTogether.ToString("N0", CultureInfo.InvariantCulture);

        public DateTimeOffset LastAnniversary { get; }

        public DateTimeOffset NextAnniversary { get; }

        public TimeSpan TimeLeft { get; }

        public bool IsCelebrating { get; }

        public string YearsLabel => YearsTogether == 1 ? "Year" : "Years";

        /// <summary>ส่งให้ JavaScript ใช้คำนวณต่อฝั่ง browser</summary>
        public string StartDateIso => Options.StartDate.ToString("yyyy-MM-dd'T'HH:mm:sszzz", CultureInfo.InvariantCulture);

        /// <summary>เช่น "23 พฤษภาคม 2570"</summary>
        public string NextAnniversaryThai =>
            $"{NextAnniversary.Day} {ThaiMonths[NextAnniversary.Month - 1]} {NextAnniversary.Year + 543}";

        private DateTimeOffset AnniversaryOf(int n) => Options.StartDate.AddYears(n);
    }
}
