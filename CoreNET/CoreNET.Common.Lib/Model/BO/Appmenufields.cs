using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  #region CoreNET.Common.Base.Appmenufields, CoreNET.Common.Lib
  [Serializable]
  public class Appmenufields : BaseBO
  {
    #region Properties 
    public string Coltype { get; set; }
    public string Dataref { get; set; }
    public string Datarule { get; set; }
    public int Datasize { get; set; }
    public string Datatype { get; set; }
    public short Displaystatus { get; set; }
    public string Idmenu { get; set; }
    public string Kdfield { get; set; }
    public string Nmfield { get; set; }
    public int Orderno { get; set; }
    public short Readwritestatus { get; set; }
    public string Rowtype { get; set; }
    public string Urfield { get; set; }
    #endregion Properties 

    #region Methods 
    #endregion
  }
  #endregion Appmenufields
}

