using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Class for ConfigItem.ObjectRead 
  /// Represent payload for value read from meter
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class ConfigValue
  {
    public int? ID { get; set; }
    public string DataType { get; set; }
    public string Name { get; set; }
    public int Size { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; }
    //it could be primitype type or List<ConfigValue>
    public object Value { get; set; }
    public bool? IsEqual { get; private set; }

    //default constructor need by json deserialization
    public ConfigValue()
    {

    }
    public ConfigValue(ConfigItem metadata, object value, bool visible = false)
    {
      if (visible) // for compare setup, Needed ObisDetail's ID and Name
      {
        Name = metadata.Name != null ? metadata.Name : null;
        ID = metadata.ID;
      }
      DataType = metadata.DataType;
      Size = (metadata.Items != null) && (metadata.Items.Count > 0) ? metadata.Items.Count : 1;
      if ((value != null) && typeof(IList).IsInstanceOfType(value))
      {
        Size = ((IList)value).Count;
      }
      Value = value;// EvaluateToDisplayField(value, metadata);
      Success = true;
    }
    public RootConfigValue Deserialize(object value)
    {
      RootConfigValue root = null;
      //Deserialize json to object struct-array-struct
      string json = JsonConvert.SerializeObject(this.Value);
      root = JsonConvert.DeserializeObject<RootConfigValue>(json);
      for (int i = 0; i < root.Value.Count; i++)
      {
        try
        {
          ArrayStructConfigValue memberArray = JsonConvert.DeserializeObject<ArrayStructConfigValue>(root.Value[i].Value.ToString());
          root.Value[i].Value = memberArray;
        }
        catch
        {
          try
          {
            object oval = JsonConvert.DeserializeObject(root.Value[i].Value.ToString());
            root.Value[i].Value = oval.ToString();
          }
          catch
          {
            root.Value[i].Value = root.Value[i].Value.ToString();
          }
        }
      }
      return root;
    }
    public string ConstructMddcsPayload(int i, StageData metadata)
    {
      bool isStructArrayStruct = (metadata.Items[i].UITemplate != 0);// ComplexTypes.IsComplexType(metadata.DataType)
      if (isStructArrayStruct)
      {
        if (typeof(RootConfigValue).IsInstanceOfType(this))
        {
          RootConfigValue root = (RootConfigValue)this;
          string displayDataType = metadata.Items[0].DisplayDataType;
          return ConstructMddcsPayload(displayDataType, metadata, root);
        }
        else
        {
          //Deserialize json to object struct-array-struct
          string json = JsonConvert.SerializeObject(this.Value);
          RootConfigValue root = JsonConvert.DeserializeObject<RootConfigValue>(json);
          string displayDataType = metadata.Items[0].DisplayDataType;
          return ConstructMddcsPayload(displayDataType, metadata, root);
        }
      }
      else
      {
        BaseStageHelper helper = new BaseStageHelper(metadata);
        ConfigMetaData itemMd = metadata.Items[0];
        ConfigValue mddcsPayload = helper.ToMddcsPayload(this, itemMd);
        Success = helper.StatusOK;
        Message = helper.Message;
        return mddcsPayload.Value.ToString();
      }
    }
    public string ConstructMddcsPayload(string displayDataType, StageData metadata, RootConfigValue root)
    {
      ConfigValue mddcsPayload = new ConfigValue();

      metadata.Value = mddcsPayload;
      return JsonConvert.SerializeObject(mddcsPayload);
    }
    public new string ToString()
    {
      return base.ToString();
    }

    public static bool EqualData(object onlineData, object offlineData)
    {
      // If memory location is same, assume two objects are equal. Then return true.
      if (ReferenceEquals(onlineData, offlineData)) return true;
      // If any of objects is null, assume two objects are not equal. Then return false.
      if ((onlineData == null) || (offlineData == null)) return false;
      // If two objects are not equal data type, assume not equal. Then return false.
      //if (onlineData.GetType() != offlineData.GetType()) return false;
      // Check the value inside two objects are equal or not.
      bool equal = EqualObject(onlineData, offlineData);

      return equal;
    }
    public static bool EqualObject(object onlineData, object offlineData)
    {
      ConfigValue onlineValue = (ConfigValue)onlineData;
      ConfigValue offlineValue = (ConfigValue)offlineData;
      // assume for complex stage
      if (onlineValue.Value is IList)
      {
        // for complex stage, need to check two lists are equal or not.
        return EqualList(onlineValue.Value, offlineValue.Value);
      }
      else // assume for basic stage
      {
        // Only need to check the values inside of two object are equal or not.
        return EqualValue(onlineValue, offlineValue);
      }
    }
    /// <summary>
    /// Check for root struct ConfigValue.
    /// </summary>
    public static bool EqualList(object onlineValue, object offlineValue)
    {
      // If two objects are not same data type, assume not equal and then return false.
      //if (onlineValue.GetType() != offlineValue.GetType()) return false;
      IList onlineValues = (IList)onlineValue;
      IList offlineValues = (IList)offlineValue;
      // If two lists are not same size, assume these two lists are different and then return false.
      if (onlineValues.Count != offlineValues.Count) return false;

      // To keep the IDs of configValue, when members of two list are equal.
      List<int?> removeIDs = new List<int?>();
      for (int i = 0; i < onlineValues.Count; i++)
      {
        ConfigValue onlineVal = (ConfigValue)onlineValues[i];
        ConfigValue offlineVal = (ConfigValue)offlineValues[i];
        if (onlineVal.Value is IList) // Assume Array List
        {
          // Check two arrays are equal or not.
          if (EqualArray(onlineVal.Value, offlineVal.Value))
          {
            onlineVal.IsEqual = offlineVal.IsEqual = true;
            removeIDs.Add(onlineVal.ID);
          }
          else
          {
            onlineVal.IsEqual = offlineVal.IsEqual = false;
          }
        }
        else
        {
          // Check values of two object are equal. Eq. RecordingInterval between online and offline
          if (EqualValue(onlineVal, offlineVal))
          {
            onlineVal.IsEqual = offlineVal.IsEqual = true;
            removeIDs.Add(onlineVal.ID);
          }
          else
          {
            onlineVal.IsEqual = offlineVal.IsEqual = false;
          }
        }
      }

      // if original count and removeIDs count is equal, we can assume it is equal.
      return onlineValues.Count == removeIDs.Count && offlineValues.Count == removeIDs.Count;
    }
    public static bool EqualArray(object onlineValue, object offlineValue)
    {
      // If two arrays are not same data type, assume they are not equal.
      if (onlineValue.GetType() != offlineValue.GetType()) return false;
      IList onlineValues = (IList)onlineValue;
      IList offlineValues = (IList)offlineValue;
      // If two arrays' sizes are different, assuem they are not equal.
      if (onlineValues.Count != offlineValues.Count) return false;
      // Order by Column Value for Array Table. Eg. Order By Register ID for LP Register Channel Table.
      onlineValues = onlineValues.OfType<ConfigValue>().ToList().OrderBy(x => GetValue(x.Value)).ToList();
      offlineValues = offlineValues.OfType<ConfigValue>().ToList().OrderBy(x => GetValue(x.Value)).ToList();
      // After sorting, we can check the values are equal or not by Json Converter.
      return EqualValue(onlineValues, offlineValues);
    }
    public static bool EqualValue(object onlineValue, object offlineValue)
    {
      //Convert online data object to json string.
      var onlineJson = JsonConvert.SerializeObject(onlineValue);
      //Convert offline data object to json string
      var offlineJson = JsonConvert.SerializeObject(offlineValue);
      // Check two json strings are equal or not.
      return onlineJson == offlineJson;
    }
    public static object GetValue(object arrayMembers)
    {
      IList arrayMemberList = (IList)arrayMembers;
      // To get first Column of Array Table.
      return ((ConfigValue)arrayMemberList[0]).Value;
    }
  }

  public class StringDlmsDataType : List<string>
  {
    private readonly static List<string> TypeNames = new List<string>(new string[] {
      "OctetString"
    });

    public static bool IsNeedBeEvaluated(string dataType)
    {
      return TypeNames.Contains(dataType);
    }

  }
}
