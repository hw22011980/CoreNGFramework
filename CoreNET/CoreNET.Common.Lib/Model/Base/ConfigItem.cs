using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Class for data that stored in ConfigListPayload and will be deserialized into json in runtime
  /// Represent Database Records from tblDeviceStageObis
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class ConfigItem : StageData
  {
    public new int ID { get; set; }
    [JsonIgnore]
    public string OBISCode { get; set; }
    [JsonIgnore]
    public byte Ic { get; set; }
    [JsonIgnore]
    public int Index { get; set; }
    public string DisplayDataType { get; set; }
    public string Min { get; set; }
    public string Max { get; set; }
    public string PrefixUnit { get; set; }
    public string PostfixUnit { get; set; }
    [JsonIgnore]
    public string VariableName { get; set; }
    [JsonIgnore]
    public string Formula { get; set; }
    [JsonIgnore]
    public int DisplayStatus { get; set; }
    public bool Visible { get; set; }
    public bool Visible2 { get; set; }
    public List<AvailableValue> AvailableValues { get; set; }
    public string EnumGroup { get; set; }

    public ConfigItem(int modelID): base(modelID)
    {
      ModelID = modelID;
      Value = string.Empty;
    }
    public ConfigItem(int modelID, StageMenuBO bo) : base(modelID)
    {
      ModelID = modelID;
      ID = bo.DeviceStageObisId;
      Name = bo.StageObisName;
      OBISCode = bo.ObisCode;
      Ic = byte.Parse(bo.ObisIc);
      Index = int.Parse(bo.ObisIndex);
      DataType = bo.ObisType;
      DisplayDataType = bo.DisplayDataType;
      VariableName = bo.VariableName;
      Size = bo.ObisSize;
      Min = bo.ObisMin;
      Max = bo.ObisMax;
      PrefixUnit = bo.ObisPreUnit;
      PostfixUnit = bo.ObisPostUnit;
      Value = bo.ObisDefault;
      DisplayStatus = bo.DisplayStatus;
      ReadWriteStatus = bo.ReadWriteStatus;
      Visible = (DisplayStatus == ConfigMetaData.VISIBLE_ITEM);
      ReadOnly = AccessLevel.Instance.GetReadOnlyStatus(AccessLevelEnum.Administrator, ReadWriteStatus);
      AvailableValues = AvailableValue.SetAvailableValues(modelID, bo.EnumGroup, bo.ObisAvailableValue);

      if (ComplexTypes.IsComplexType(bo.ObisType) && (bo.ObisSize > 0))
      {
        //Complex Obis
        List<StageValueBO> breakDownObis = DBHelper.Instance.GetDeviceObisDetailByObisID(bo.DeviceStageObisId);
        List<StageValueBO> roots = breakDownObis.FindAll(o => o.ParentDeviceStageObisDetailId == -1);
        Items = ConfigMetaData.ConstructBreakDownValues(modelID, breakDownObis, roots);
      }

    }

  }

  public class OBISTYPE : Dictionary<string, int>
  {
    private static OBISTYPE _Instance = null;
    public static OBISTYPE Instance
    {
      get
      {
        if (_Instance == null)
        {
          _Instance = new OBISTYPE();
        }
        return _Instance;
      }
    }

    public OBISTYPE()
    {
      this.Add("null", 0);
      this.Add("array", 1);
      this.Add("structure", 2);
      this.Add("boolean", 3);
      this.Add("bitstring", 4);
      this.Add("doublelong", 5);
      this.Add("doublelongunsigned", 6);
      this.Add("floatingpoint", 7);
      this.Add("octetstring", 9);
      this.Add("visiblestring", 10);
      this.Add("bcd", 13);
      this.Add("integer", 15);
      this.Add("long", 16);
      this.Add("unsigned", 17);
      this.Add("longunsigned", 18);
      this.Add("long64", 20);
      this.Add("long64unsigned", 21);
      this.Add("enum", 22);
    }

    public int ToObisType(string strtype)
    {
      return (int)this[strtype.ToLower()];
    }
    public string ToString(int inttype)
    {
      return this.ToList().Find(o => o.Value == inttype).Key;
    }
  }
}


