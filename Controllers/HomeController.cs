using AnniversaryofLove.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace AnniversaryofLove.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AnniversaryOptions _anniversary;

        public HomeController(ILogger<HomeController> logger, IOptions<AnniversaryOptions> anniversary)
        {
            _logger = logger;
            _anniversary = anniversary.Value;
        }

        public IActionResult Index()
        {
            return View(new AnniversaryViewModel(_anniversary, DateTimeOffset.UtcNow));
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
