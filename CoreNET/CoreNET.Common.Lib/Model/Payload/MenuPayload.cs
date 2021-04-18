using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class MenuPayload : BasePayload, IPayload
  {
    public long Id { get; set; }
    public string Name { get; set; }
    public bool Enable { get; set; }
    public bool Visible { get; set; }
    public int UITemplate { get; set; }
    public int Selected { get; set; }
    public List<MenuPayload> Children { get; set; }

    public MenuPayload()
    {
      //default UI Template
      UITemplate = -1;
    }

    public static List<MenuPayload> Convert(List<Appmenu> temps)
    {
      List<MenuPayload> data = new List<MenuPayload>();
      foreach (var o in temps)
      {
        MenuPayload menu = Convert(o);
        data.Add(menu);
      }
      return data;
    }

    private static MenuPayload Convert(Appmenu o)
    {
      MenuPayload data = new MenuPayload();
      data.Id = o.Idmenu;
      data.Name = o.Nmmenu;
      data.Enable = true;
      data.Visible = true;
      data.UITemplate = 1;
      data.Selected = 0;
      if (o.Children != null)
      {
        data.Children = o.Children.ConvertAll(new Converter<Appmenu, MenuPayload>(delegate (Appmenu o) { return Convert(o); }));
      }
      return data;
    }
  }
}
