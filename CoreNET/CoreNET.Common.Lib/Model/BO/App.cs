using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  #region CoreNET.Common.Base.App, CoreNET.Common.Lib
  [Serializable]
  public class AppControl : BaseBO
  {
    #region Properties 
    public string Idapp { get; set; }
    public string Kdapp { get; set; }
    public string Nmapp { get; set; }
    public string Url { get; set; }
    #endregion Properties 
    #region Methods 
    #endregion
  }
  #endregion App
}

