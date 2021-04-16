using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreNET.Common.Base
{

  public class BaseStageHelper : IStageHelper
  {
    private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
    public const string DefaultNameSpace = "CoreNET.Common";
    public const string BaseLibrary = "Device.Base";
    public const string PrefixDevice = "Device.";
    public const string MeterTypeBaseLibrary = "Device.{0}";
    public const string MeterModelBaseLibrary = "Device.{0}.{1}";
    public const string Stage = "Stage";
    public const string Sites = "Sites";
    public const string Helper = "Helper";
    public const string UNSIGN = "unsign";

    public static bool Debug { get; set; }
    public static string Library_PathName { get; set; }
    public bool StatusOK { get; set; }
    public string Message { get; set; }
    public int ModelID { get; set; }
    public StageData Payload { get; set; }

    public ConfigValue MddcsPayload { get; set; }

    static Dictionary<int, string> _modelLibs = null;
    static Dictionary<int, string> ModelLibs
    {
      get
      {
        if (_modelLibs == null)
        {
          _modelLibs = new Dictionary<int, string>();
          _modelLibs[1] = "10X";
          _modelLibs[2] = "2PX";
          _modelLibs[3] = "2HX";
        }
        return _modelLibs;
      }
    }
    public static string GetDeviceModelNameByModelID(int modelId)
    {
      return ModelLibs[modelId];
    }
    public const int METER_BASE = 1;
    public const int METER_TYPE = 2;
    public const int METER_MODEL = 3;
    public static string FindLibrary(string libraryName)
    {
      string dllFile = string.Empty;

      string curpath = AppDomain.CurrentDomain.BaseDirectory;

      dllFile = $@"{curpath}\{BaseStageHelper.Library_PathName}\{libraryName}.dll";
      if (!File.Exists(dllFile))
      {
        dllFile = $@"{curpath}\{libraryName}.dll";
      }
      return dllFile;
    }
    public static Type LoadType(string dllFile, string typeName)
    {
      Type t = null;
      try
      {
        if (File.Exists(dllFile))
        {
          t = Assembly.LoadFrom(dllFile).GetType(typeName);
        }
      }
      catch (Exception ex)
      {
        log.Error(ex.StackTrace);
      }
      log.Info($"Load {typeName} from {dllFile} {(t == null ? "not " : string.Empty)} successful.");
      return t;
    }
    public BaseStageHelper(StageData payload)
    {
      Payload = new StageData(payload.ModelID);
      ModelID = payload.ModelID;
      ConfigItemHelper.CopyProperties(payload, Payload);
      Payload.Items = payload.Items;
      if (Payload.Items.Count > 0)
      {
        Payload.BackupItems = payload.Items[0].Items;
      }
    }
    public ConfigValue ToMddcsPayload(ConfigValue EngineValue, ConfigMetaData MetaData)
    {
      StatusOK = true;
      MddcsPayload = EngineValue;
      return MddcsPayload;
    }

    public StageData ToEnginePayload(List<ConfigValue> values)
    {
      // Default for complex stages
      Payload = Payload.SetObjectReadSingle(values, true);

      StageData enginePayload = null;

      StageData backup = new StageData(ModelID);
      ConfigItemHelper.CopyProperties(Payload, backup);


      return enginePayload;
    }
    public StageData ToMainPayload()
    {

      return Payload;
    }
    public StageData ToLookupPayload()
    {
      List<ConfigValue> values = (List<ConfigValue>)Payload.ObjectsRead.Value;
      return Payload;
    }
    public ConfigValue GetValue(int i, StageData metadata, List<ConfigValue> data, bool isOnline = true)
    {
      return data[i];
    }
    public ConfigValue GetValueOffline(int i, StageData metadata, List<ConfigValue> data)
    {
      return data[i];
    }

    #region Shared Methods
    protected bool IsComplexType(ConfigMetaData md)
    {
      return (ComplexTypes.IsComplexType(md.DataType) || ComplexTypes.IsComplexType(md.DisplayDataType));
    }
    protected bool IsStructureType(ConfigMetaData md)
    {
      return (ComplexTypes.IsStructureType(md.DataType) || ComplexTypes.IsStructureType(md.DisplayDataType));
    }
    protected bool IsArrayType(ConfigMetaData md)
    {
      return (ComplexTypes.IsArrayType(md.DataType) && ComplexTypes.IsArrayType(md.DisplayDataType));
    }
    public bool ValidateValue(int deviceId, bool online, out string message)
    {
      message = string.Empty;
      return true;
    }

    public static void SaveToFile(object payload, string fname)
    {
      try
      {
        var jsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings
        {
          NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
          ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()

        };
        string json = JsonConvert.SerializeObject(payload, Newtonsoft.Json.Formatting.Indented, jsonSerializerSettings);
        System.IO.File.WriteAllText(fname, json);
      }
      catch { }
    }
    #endregion
  }

  #region Models
  public class RootConfigValue : ConfigValue
  {
    public new RootStructConfigValue Value
    {
      get
      {
        return (RootStructConfigValue)base.Value;
      }
      set
      {
        base.Value = value;
      }
    }
    public RootConfigValue()
    {
    }
  }
  public class RootStructConfigValue : List<ConfigValue>
  {
    //MemberObjectConfigValue as ObjectConfigValue
    //MemberArrayConfigValue as ConfigValue
  }
  public class MemberObjectConfigValue : ObjectConfigValue { }
  public class MemberArrayConfigValue : ConfigValue
  {
    //Value is as List<MemberArrayStructConfigValue>/ArrayStructConfigValue
    public new ArrayStructConfigValue Value
    {
      get
      {
        return (ArrayStructConfigValue)base.Value;
      }
      set
      {
        base.Value = value;
      }
    }
    public MemberArrayConfigValue()
    {
      DataType = "Array";
    }
  }
  public class ArrayStructConfigValue : List<MemberArrayStructConfigValue>
  {
  }

  public class CopyOfArrayStructConfigValue : List<MemberArrayStructConfigValue>
  {
  }
  public class MemberArrayStructConfigValue : ConfigValue
  {
    public new StructConfigValue Value
    {
      get
      {
        return (StructConfigValue)base.Value;
      }
      set
      {
        base.Value = value;
      }
    }
  }

  public class CopyOfStructConfigValue : List<ObjectConfigValue>
  {

  }
  public class StructConfigValue : List<ObjectConfigValue>, IList
  {

  }
  public class ObjectConfigValue : ConfigValue
  {
    public ObjectConfigValue() { }
    public ObjectConfigValue(ConfigItem metadata, object value, bool visible = false) : base(metadata, value, true) { }

    public new object Value
    {
      get
      {
        return base.Value;
      }
      set
      {
        base.Value = value;
      }
    }
  }

  public class CopyOfObjectConfigValue : ConfigValue
  {
    public new object Value
    {
      get
      {
        return base.Value;
      }
      set
      {
        base.Value = value;
      }
    }
  }
  #endregion
}
