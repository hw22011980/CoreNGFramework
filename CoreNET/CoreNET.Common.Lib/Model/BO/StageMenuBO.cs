using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class StageMenuBO : BaseBO
  {
    public int DeviceStageId { get; set; }
    public string StageName { get; set; }
    public int DeviceStageParamId { get; set; }
    public string StageParamName { get; set; }
    public int UITemplate { get; set; }
    public int DeviceStageObisId { get; set; }
    public string StageObisName { get; set; }
    public string ObisCode { get; set; }
    public string ObisIc { get; set; }
    public string ObisIndex { get; set; }
    public string ObisType { get; set; }
    public int DeviceStageObisDetailId { get; set; }
    public int ParentDeviceStageObisDetailId { get; set; }
    public int ObisSize { get; set; }
    public string ObisMin { get; set; }
    public string ObisMax { get; set; }
    public string ObisPreUnit { get; set; }
    public string ObisPostUnit { get; set; }
    public string ObisDefault { get; set; }
    public string ObisAvailableValue { get; set; }
    public string EnumGroup { get; set; }
    public string DisplayDataType { get; set; }
    public string VariableName { get; set; }
    public string Formula { get; set; }
    public int StageReadWriteStatus { get; set; }
    public int ReadWriteStatus { get; set; }
    public int DisplayStatus { get; set; }
    public string Message { get; set; }
  }
}
