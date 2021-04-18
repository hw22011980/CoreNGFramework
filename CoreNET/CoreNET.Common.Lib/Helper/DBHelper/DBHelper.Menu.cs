using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public partial class DBHelper
  {
    public List<Appmenu> GetMenu(string idapp)
    {
      List<Appmenu> MenuLevel1 = GetAppMenu(idapp, 1);
      foreach (Appmenu m in MenuLevel1)
      {
        List<Appmenu> MenuLevel2 = GetAppMenu(idapp, 2);
        m.Children = MenuLevel2;
      }
      return MenuLevel1;
    }
    private List<Appmenu> GetAppMenu(string idapp, int kdlevel)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
              select rtrim(IDAPP) as IDAPP,rtrim(KDMENU) as KDMENU,
              IDMENU,rtrim(NMMENU) as NMMENU,rtrim(NMTABEL) as NMTABEL,
              rtrim(URMENU) as URMENU,rtrim(URL) as URL,rtrim(ICON) as ICON,
              STATUS,KDLEVEL,TYPE
              from APPMENU
              where IDAPP={idapp} and KDLEVEL={kdlevel}
          ";
      List<Dictionary<string, object>> list = DataAdapter.ExecuteSelect(cs, sql);
      List<Appmenu> data = Appmenu.ConvertList(list);
      return data;
    }
  }
}
