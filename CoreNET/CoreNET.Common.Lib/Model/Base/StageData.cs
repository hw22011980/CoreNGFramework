using Newtonsoft.Json;
using System;
using System.Reflection;
using System.Collections;
using System.Collections.Generic;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Class for data that stored in ConfigListPayload and will be deserialized into json in runtime
  /// Represent Single Database Record from tblDeviceStageParam and its children from tblDeviceStageObis and tblDeviceStageObisDetail
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class StageData : BaseBO
  {
    private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
    public string ID { get; set; }
    public string Name { get; set; }
    public string Message { get; set; }
    public string DataType { get; set; }
    [JsonIgnore]
    public int ModelID { get; set; }
    [JsonIgnore]
    public UIConfig Config { get; set; }
    [JsonIgnore]
    public int UITemplate { get; set; }
    public int Size { get; set; }
    [JsonIgnore]
    public int ReadWriteStatus { get; set; }
    public bool ReadOnly { get; set; }
    public bool Enabled { get; set; } // if array - false : unable to add delete row
    public List<ConfigMetaData> Items { get; set; }
    [JsonIgnore]
    public List<ConfigMetaData> BackupItems { get; set; }
    public object Value { get; set; }
    public ConfigValue ObjectsRead { get; set; }
    public ConfigValue ObjectsLookup { get; set; }

    public StageData()
    {
    }
    public StageData(int modelID)
    {
      ModelID = modelID;
      Items = new List<ConfigMetaData>();
      Config = new UIConfig();
    }
    public ConfigMetaData GetMddcsMetadata()
    {
      //Complex stages rule, mddcs metadata is the first item collection
      return Items[0];
    }
    // Deprecated, replace by IStageHelper.GetEngineMetadata()
    //public ConfigMetaData GetEngineMetadata()
    //{
    //  //Complex stages rule, engine metadata is the second item collection
    //  return Items[Items.Count - 1];
    //}

    public bool IsRootTableType()
    {
      if (this.Items != null)
      {
        return ComplexTypes.IsArrayType(this.Items[0].DataType);
      }
      else
      {
        return false;
      }
    }
    public StageData SetObjectReadSingle(RootConfigValue root, bool allsuccess)
    {
      return SetObjectReadSingle(root.Value, allsuccess);
    }
    public StageData SetObjectReadSingle(List<ConfigValue> values, bool allsuccess)
    {
      ConfigMetaData metadata = null;
      bool needChange = ComplexTypes.IsComplexType(this.Items[0].DataType);
      if (this.IsRootTableType())
      {
        metadata = new ConfigMetaData(ModelID) { Size = values.Count };
        ConfigValue parentVal = new ConfigValue(metadata, values) { Success = allsuccess, DataType = "Structure" };
        StageData newdata = new StageData(ModelID)
        {
          Size = 1,
          ID = this.ID,
          Name = this.Name,
          UITemplate = this.UITemplate,
          ReadWriteStatus = this.ReadWriteStatus,
          ReadOnly = this.ReadOnly,
          Message = string.IsNullOrEmpty(this.Message) ? null : this.Message
        };
        ConfigMetaData parentMD = new ConfigMetaData(ModelID)
        {
          ID = this.Items[0].ID * 100,
          Name = this.Items[0].Name + " - Struct",
          Value = null,
          Size = 1,
          DataType = ComplexTypes.STRUCTURE,
          DisplayDataType = (!string.IsNullOrEmpty(this.Items[0].DisplayDataType)) ? this.Items[0].DisplayDataType : ComplexTypes.STRUCT_TABLE,
          Visible = this.Items[0].Visible,
          ReadOnly = this.Items[0].ReadOnly,
          Min = this.Items[0].Min,
          Max = this.Items[0].Max,
          Items = new List<ConfigMetaData>(new ConfigMetaData[] { this.Items[0] })
        };
        //Reset child
        this.Items[0].DisplayDataType = ComplexTypes.TABLE;
        this.Items[0].Name = this.Items[0].Name + " - Table";
        newdata.ObjectsRead = parentVal;
        if (values.Count > 1)//dataLookup
        {
          ConfigMetaData MDLookup = new ConfigMetaData(ModelID)
          {
            ID = this.Items[1].ID,
            Value = null,
            Size = 1,
            DataType = ComplexTypes.STRUCTURE,
            DisplayDataType = (!string.IsNullOrEmpty(this.Items[1].DisplayDataType)) ? this.Items[1].DisplayDataType : ComplexTypes.STRUCT_TABLE,
            Visible = this.Items[1].Visible,
            ReadOnly = this.Items[1].ReadOnly,
            Items = new List<ConfigMetaData>(new ConfigMetaData[] { this.Items[1] })
          };
          newdata.ObjectsLookup = values[1];

          newdata.Items = new List<ConfigMetaData>(new ConfigMetaData[] { parentMD, MDLookup });
        }
        else
        {
          newdata.Items = new List<ConfigMetaData>(new ConfigMetaData[] { parentMD });
        }
        return newdata;
      }
      else//??
      {
        //Reset child
        if (!this.Items[0].Name.ToLower().EndsWith("struct"))
        {
          this.Items[0].Name = this.Items[0].Name + " - Struct";
          if (values.Count > 0)
          {
            this.ObjectsRead = values[0];
            if (values.Count > 1)//dataLookup
            {
              ConfigMetaData MDLookup = new ConfigMetaData(ModelID)
              {
                ID = this.Items[1].ID,
                Value = null,
                Size = 1,
                DataType = ComplexTypes.STRUCTURE,
                DisplayDataType = (!string.IsNullOrEmpty(this.Items[1].DisplayDataType)) ? this.Items[1].DisplayDataType : ComplexTypes.STRUCT_TABLE,
                Visible = this.Items[1].Visible,
                ReadOnly = this.Items[1].ReadOnly,
                Items = new List<ConfigMetaData>(new ConfigMetaData[] { this.Items[1] })
              };
              this.Items[1] = MDLookup;
              List<ConfigValue> tempValues = new List<ConfigValue>(new ConfigValue[] { values[1] });
              this.ObjectsLookup = new ConfigValue(MDLookup, tempValues) { Success = allsuccess };
            }
          }
        }
      }
      return this;
    }
    public StageData SetObjectReadMultiple(IList values, bool allsuccess)
    {
      ConfigMetaData metadata = null;
      ConfigValue value = null;
      if (UITemplate == 0)//Basic Stage
      {
        metadata = new ConfigMetaData(ModelID) { Size = values.Count };
        value = new ConfigValue(metadata, values) { Success = allsuccess };
        this.ObjectsRead = value;
      }
      else
      {
        metadata = new ConfigMetaData(ModelID) { Size = values.Count };
        value = new ConfigValue(metadata, values) { Success = allsuccess };
        this.ObjectsRead = value;
      }
      return this;
    }
    public StageData ConstructEnginePayload(List<ConfigValue> values)
    {
      if (this.Items.Count == 0)
      {
        Message = MessageHelper.GetInvalidDataMessage(MessageHelper.INVALID_METADATA);
        return this;
      }

      // defaut setObjectRead use for multiple obis items
      // Default format for ObjectRead is an object contains array of values from multiple obis items
      SetObjectReadMultiple(values, true);

      StageData enginePayload = null;
      IStageHelper helper = null;
      enginePayload = helper.ToEnginePayload(values);

      return enginePayload;
    }

  }
}
