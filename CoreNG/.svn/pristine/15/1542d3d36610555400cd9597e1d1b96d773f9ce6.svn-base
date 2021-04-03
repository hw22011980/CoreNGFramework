using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace CoreNG.API.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class DemoController : ControllerBase
  {
    private readonly ILogger<WeatherForecastController> _logger;

    public DemoController(ILogger<WeatherForecastController> logger)
    {
      _logger = logger;
    }

    [HttpGet]
    public string Get()
    {
      string path = Directory.GetCurrentDirectory();
      string json = System.IO.File.ReadAllText($"{path}/Demo/menu.json");
      return json;
    }
    [HttpGet("{id}")]
    public string Get(int id)
    {
      string path = Directory.GetCurrentDirectory();
      string json = System.IO.File.ReadAllText($"{path}/Demo/page{id}.json");
      return json;
    }
  }
}
