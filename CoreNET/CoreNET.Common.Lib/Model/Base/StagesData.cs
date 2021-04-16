using Newtonsoft.Json;
using System;
using System.Reflection;
using System.Collections;
using System.Collections.Generic;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Class for data that stored in ConfigListPayload and will be deserialized into json in runtime
  /// Represent Database Records from tblDeviceStageParam
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class ConfigStage
  {
    public int ID { get; set; }
    public string Name { get; set; }
    public int Size { get; set; }
    public string Message { get; set; }
    public List<StageData> Params { get; set; }
    public ConfigStage()
    {
      Params = new List<StageData>();
    }
  }
  public class StagesData : List<ConfigStage>
  {
    public ConfigValue ObjectsRead { get; set; }
  }
}
