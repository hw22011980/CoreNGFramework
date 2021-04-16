using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  public class MenuBO : BaseBO
  {
    #region Properties 
    public string Icon { get; set; }
    public string Idapp { get; set; }
    public long Idmenu { get; set; }
    public string Kdmenu { get; set; }
    public string Nmmenu { get; set; }
    public string Nmtabel { get; set; }
    public string Url { get; set; }
    public string Urmenu { get; set; }
    public List<MenuBO> Children { get; set; }
    #endregion Properties 

    #region Methods   
    internal static List<MenuBO> ConvertList(List<Dictionary<string, object>> list)
    {
      string json = JsonConvert.SerializeObject(list);
      List<MenuBO> data = JsonConvert.DeserializeObject<List<MenuBO>>(json);
      return data;
    }
    #endregion
  }
  public class Menu : BaseBO
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public bool Enable { get; set; }
    public bool Visible { get; set; }
    public int UITemplate { get; set; }
    public int Selected { get; set; }
    public MenuBO[] Children { get; set; }

    public Menu()
    {
      //default UI Template
      UITemplate = -1;
    }
  }
}
