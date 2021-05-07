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
  public class UiController : ControllerBase
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

    public UiController(ILogger<WeatherForecastController> logger, IConfiguration configuration)
    {
      _logger = logger;
      _configuration = configuration;
    }

    /// <summary>
    /// https://localhost:5001/api/ui/1/menu/0
    /// </summary>
    /// <param name="idApp"></param>
    /// <param name="mode"></param>
    /// <param name="idMenu"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("{idApp}/{mode}/{idMenu}")]
    public string Get(string idApp, string mode, int idMenu = 0)
    {
      string json = "[]";
      switch (mode)
      {
        case "menu":
          List<MenuPayload> data = GetListofMenu(idApp);
          json = JSONHelper.ToBeautifyJson(data);
          break;
        case "view":
          UIPayload payload = new UIPayload();
          payload.Id = 1;
          payload.Name = "Rencana Kerja Anggaran";
          json = JSONHelper.ToBeautifyJson(payload);
          break;
      }
      return json;
    }
    private List<MenuPayload> GetListofMenu(string idApp)
    {
      List<Appmenu> temp = dbHelper.GetMenu(idApp);
      List<MenuPayload> data = MenuPayload.Convert(temp);
      return data;
    }
  }
}
