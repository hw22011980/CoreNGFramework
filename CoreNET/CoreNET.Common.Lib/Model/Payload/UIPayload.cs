using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class UIPayload : BasePayload, IPayload
  {
    public long Id { get; set; }
    public string Name { get; set; }
    public bool Enable { get; set; }
    public bool Visible { get; set; }
    public int Selected { get; set; }
    public UIPayloadConfig Config { get; set; }
    public UIPayloadData Data { get; set; }

  }
}
