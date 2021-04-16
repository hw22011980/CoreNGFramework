using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using CoreNET.Common.Base;

namespace CoreNET.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class MenuController : ControllerBase
  {
    DBHelper _dbHelper = null;
    DBHelper dbHelper
    {
      get
      {
        if (_dbHelper == null)
        {
          _dbHelper = new DBHelper();
          string cs = _configuration.GetValue<string>("Modules:Default:ConnectionString");
          _dbHelper.ConnectionString = cs;
          _dbHelper.IsOriginal = 1;
          _dbHelper.LanguageID = 0;
        }
        return _dbHelper;
      }
    }
    private readonly ILogger<WeatherForecastController> _logger;
    private readonly IConfiguration _configuration;

    public MenuController(ILogger<WeatherForecastController> logger, IConfiguration configuration)
    {
      _logger = logger;
      _configuration = configuration;
    }

    [HttpGet]
    public string Get()
    {
      string idApp = "1";
      List<MenuPayload> data = GetListofMenu(idApp);
      string json = JSONHelper.ToBeautifyJson(data);
      return json;
    }
    private List<MenuPayload> GetListofMenu(string idApp)
    {
      List<MenuBO> temp = dbHelper.GetMenu(idApp);
      List<MenuPayload> data = MenuPayload.Convert(temp);
      return data;
    }
  }
}
