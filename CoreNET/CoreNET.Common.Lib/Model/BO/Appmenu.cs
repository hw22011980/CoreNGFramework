using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  #region CoreNET.Common.Base.Appmenu, CoreNET.Common.Lib
  [Serializable]
  public class Appmenu : BaseBO
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
    public List<Appmenu> Children { get; set; }
    #endregion Properties 

    #region Methods   
    internal static List<Appmenu> ConvertList(List<Dictionary<string, object>> list)
    {
      string json = JsonConvert.SerializeObject(list);
      List<Appmenu> data = JsonConvert.DeserializeObject<List<Appmenu>>(json);
      return data;
    }
    #endregion
  }
  #endregion
}
