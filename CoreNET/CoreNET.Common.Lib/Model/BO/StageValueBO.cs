using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class StageValueBO : BaseBO
  {
    public int DeviceStageObisDetailID { get; set; }
    public string Name { get; set; }
    public int ParentDeviceStageObisDetailId { get; set; }
    public string Type { get; set; }
    public int Size { get; set; }
    public string Min { get; set; }
    public string Max { get; set; }
    public string PreUnit { get; set; }
    public string PostUnit { get; set; }
    public string DefaultValue { get; set; }
    public string AvailableValue { get; set; }
    public string EnumGroup { get; set; }
    public string DisplayDataType { get; set; }
    public string VariableName { get; set; }
    public string Formula { get; set; }
    public int ReadWriteStatus { get; set; }
    public int DisplayStatus { get; set; }
  }
}
