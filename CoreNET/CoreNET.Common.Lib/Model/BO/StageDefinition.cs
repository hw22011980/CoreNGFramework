using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class StageDef : BaseBO
  {
    public int DeviceStageId { get; set; }
    public string DeviceStageName { get; set; }
    public int DeviceStageParamId { get; set; }
    public string DeviceStageParamName { get; set; }
    public int DeviceStageObisId { get; set; }
    public string DeviceStageObisName { get; set; }
    public int UITemplate { get; set; }
  }
  public class Stages
  {
    public string Name { get; set; }
    public List<StageList> Value { get; set; }
    public Stages() { }
  }
  public class StageList
  {
    public string Name { get; set; }
    public List<StageObis> Value { get; set; }
    public StageList() { }
  }
  public class StageObis
  {
    public string Name { get; set; }
    //public string Value { get; set; }
    public RootConfigValue Value { get; set; }
    public StageObis() { }
  }
}
