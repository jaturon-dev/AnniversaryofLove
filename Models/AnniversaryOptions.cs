namespace AnniversaryofLove.Models
{
    /// <summary>
    /// ตั้งค่าได้ใน appsettings.json ส่วน "Anniversary"
    /// </summary>
    public class AnniversaryOptions
    {
        /// <summary>วันและเวลาที่เริ่มคบกัน (ใส่ timezone ด้วย เช่น +07:00)</summary>
        public DateTimeOffset StartDate { get; set; } = new(2016, 5, 23, 15, 10, 0, TimeSpan.FromHours(7));

        public string Lover { get; set; } = "คุณโป้ง";

        public string Beloved { get; set; } = "คุณหมี";
    }
}
