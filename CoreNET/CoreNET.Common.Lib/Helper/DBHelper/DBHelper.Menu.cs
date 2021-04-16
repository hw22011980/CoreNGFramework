using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public partial class DBHelper
  {
    public List<MenuBO> GetMenu(string idapp)
    {
      List<MenuBO> MenuLevel1 = GetAppMenu(idapp, 1);
      foreach (MenuBO m in MenuLevel1)
      {
        List<MenuBO> MenuLevel2 = GetAppMenu(idapp, 2);
        m.Children = MenuLevel2;
      }
      return MenuLevel1;
    }
    private List<MenuBO> GetAppMenu(string idapp, int kdlevel)
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
      List<MenuBO> data = MenuBO.ConvertList(list);
      return data;
    }
  }
}
