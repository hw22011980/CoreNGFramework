using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class UIConfig
  {
    public string BtnEditInPageLabel { get; set; }
    public string BtnSaveInPageLabel { get; set; }
    public string BtnSaveInDialogLabel { get; set; }
    public UIConfig()
    {
      BtnEditInPageLabel = "Edit";
      BtnSaveInPageLabel = "Save";
      BtnSaveInDialogLabel = "Save";
    }
  }
}
