using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Class for ConfigItem.Items and repeatedly for all Items property in their children
  /// Represent Structure/Array Type metadata from Database Records in tblDeviceStageValue
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// Display Status:
  /// 0 (0x00) = remove from JSON
  /// 1 (0x01) = exist in JSON and visible is true
  /// 2 (0x02) = exist in JSON and visible is false
  /// </remarks>  
  public class ConfigMetaData : ConfigItem
  {
    public const short VISIBLE_ITEM = 1;

    public const short EXIST_IN_JSON = 1;
    public const short VISIBLE1 = 2;
    public const short VISIBLE2 = 4;

    public const string CROSS_REFERENCE = "CrossReference";
    public const string PIPE = "|";
    public const string SEMI_COLON = ";";

    public const string DELIMITER = PIPE;

    // need for clonning
    public ConfigMetaData() : base(1)
    {

    }
    public ConfigMetaData(int modelID) : base(modelID)
    {

    }
    public ConfigMetaData(ConfigMetaData bo) : base(bo.ModelID)
    {
      ID = bo.ID;
      Name = bo.Name;
      DataType = bo.DataType;
      DisplayDataType = bo.DisplayDataType;
      VariableName = bo.VariableName;
      EnumGroup = bo.EnumGroup;
      Formula = bo.Formula;
      DisplayStatus = bo.DisplayStatus;
      Visible = ((DisplayStatus & ConfigMetaData.VISIBLE1) == ConfigMetaData.VISIBLE1);
      Visible2 = ((DisplayStatus & ConfigMetaData.VISIBLE2) == ConfigMetaData.VISIBLE2);
      ReadWriteStatus = bo.ReadWriteStatus;
      ReadOnly = AccessLevel.Instance.GetReadOnlyStatus(AccessLevelEnum.Administrator, ReadWriteStatus);
      Size = bo.Size;
      Min = bo.Min;
      Max = bo.Max;
      PrefixUnit = bo.PrefixUnit;
      PostfixUnit = bo.PostfixUnit;
      Value = bo.Value;
      AvailableValues = AvailableValues;
      Items = new List<ConfigMetaData>();
    }
    public ConfigMetaData(int modelID, StageValueBO bo) : base(modelID)
    {
      ID = bo.DeviceStageObisDetailID;
      Name = bo.Name;
      DataType = bo.Type;
      DisplayDataType = bo.DisplayDataType;
      VariableName = bo.VariableName;
      EnumGroup = bo.EnumGroup;
      Formula = bo.Formula;
      DisplayStatus = bo.DisplayStatus;
      Visible = ((DisplayStatus & ConfigMetaData.VISIBLE1) == ConfigMetaData.VISIBLE1);
      Visible2 = ((DisplayStatus & ConfigMetaData.VISIBLE2) == ConfigMetaData.VISIBLE2);
      ReadWriteStatus = bo.ReadWriteStatus;
      ReadOnly = AccessLevel.Instance.GetReadOnlyStatus(AccessLevelEnum.Administrator, ReadWriteStatus);
      Size = bo.Size;
      Min = bo.Min;
      Max = bo.Max;
      PrefixUnit = bo.PreUnit;
      PostfixUnit = bo.PostUnit;
      Value = bo.DefaultValue;
      AvailableValues = AvailableValue.SetAvailableValues(modelID, bo.EnumGroup, bo.AvailableValue);
      Items = null;
    }

    public ConfigMetaData(int modelID, StageMenuBO bo) : base(modelID)
    {
      ID = bo.DeviceStageObisId;
      Name = bo.StageObisName;
      OBISCode = bo.ObisCode;
      Ic = byte.Parse(bo.ObisIc);
      Index = int.Parse(bo.ObisIndex);
      DataType = bo.ObisType;
      UITemplate = bo.UITemplate;
      DisplayDataType = bo.DisplayDataType;
      VariableName = bo.VariableName;
      EnumGroup = bo.EnumGroup;
      Formula = bo.Formula;
      DisplayStatus = bo.DisplayStatus;
      //Keep this formula for visibility Parent Obis Item (tblDeviceSTageObis)
      Visible = (DisplayStatus == ConfigMetaData.VISIBLE_ITEM);
      ReadWriteStatus = bo.ReadWriteStatus;
      ReadOnly = AccessLevel.Instance.GetReadOnlyStatus(AccessLevelEnum.Administrator, ReadWriteStatus);
      Size = bo.ObisSize;
      Min = bo.ObisMin;
      Max = bo.ObisMax;
      PrefixUnit = bo.ObisPreUnit;
      PostfixUnit = bo.ObisPostUnit;
      Value = bo.ObisDefault;
      AvailableValues = AvailableValue.SetAvailableValues(modelID, bo.EnumGroup, bo.ObisAvailableValue);
      if (ComplexTypes.IsComplexType(bo.ObisType) && (bo.ObisSize > 0))
      {
        //Complex Obis
        List<StageValueBO> breakDownObis = DBHelper.Instance.GetDeviceObisDetailByObisID(bo.DeviceStageObisId);
        List<StageValueBO> roots = breakDownObis.FindAll(o => o.ParentDeviceStageObisDetailId == -1);
        Items = ConstructBreakDownValues(modelID, breakDownObis, roots);
      }
      else
      {
        Items = null;
      }
    }
    public static List<ConfigMetaData> ConstructBreakDownValues(int modelID, List<StageValueBO> breakDownObis, List<StageValueBO> roots)
    {
      if (roots.Count == 0)
      {
        return null;
      }
      else
      {
        List<ConfigMetaData> values = new List<ConfigMetaData>();
        for (int i = 0; i < roots.Count; i++)
        {
          StageValueBO root = roots[i];
          ConfigMetaData child = new ConfigMetaData(modelID, root);
          List<StageValueBO> children = breakDownObis.FindAll(o => o.ParentDeviceStageObisDetailId == root.DeviceStageObisDetailID);
          child.Items = null;
          child.Value = root.DefaultValue;
          if (children.Count > 0)
          {
            child.Items = ConstructBreakDownValues(modelID, breakDownObis, children);
          }
          values.Add(child);
        }
        return values;
      }
    }
    public static List<ConfigMetaData> CleansingMetadata(List<ConfigMetaData> items)
    {
      List<ConfigMetaData> mds = new List<ConfigMetaData>();
      foreach (ConfigMetaData md in items)
      {
        if (!md.IsRemoveFromJSON())
        {
          if (md.Items != null)
          {
            List<ConfigMetaData> mdschildren = CleansingMetadata(md.Items);
            md.Items = mdschildren;
          }
          mds.Add(md);
        }
      }
      return mds;
    }

    private bool IsRemoveFromJSON()
    {
      return ((this.DisplayStatus & EXIST_IN_JSON) != EXIST_IN_JSON);
    }

    public static string Concatenate(string name, string sufix)
    {
      return (name.Replace(" ","").EndsWith(sufix.Replace(" ", ""))) ? name : name + sufix;
    }
    //DFS Algorithm
    public static void FindAllLookupVariables(List<ConfigMetaData> items, List<ConfigMetaData> founds)
    {
      ConfigMetaData md = null;
      if (items != null)
      {
        int i = 0;
        while (i < items.Count)
        {
          md = items[i];
          string temp = string.IsNullOrEmpty(md.VariableName) ? string.Empty : md.VariableName;
          if (temp.Equals(ComplexTypes.LOOKUP))
          {
            founds.Add(md);
          }
          //look inside
          FindAllLookupVariables(md.Items, founds);
          i++;
        }
      }
    }

    public static ConfigMetaData FindVariableByName(List<ConfigMetaData> items, string itemName)
    {
      bool found = false;
      ConfigMetaData md = null;
      if (items != null)
      {
        int i = 0;
        while ((i < items.Count) && (!found))
        {
          md = items[i];
          string temp = string.IsNullOrEmpty(md.Name) ? string.Empty : md.Name.ToLower();
          string searchName = string.IsNullOrEmpty(itemName) ? string.Empty : itemName.ToLower();
          if (temp.Equals(searchName))
          {
            found = true;
          }
          else
          {
            //look inside
            md = FindVariableByName(md.Items, searchName);
            if (md != null)
            {
              found = true;
            }
            else
            {
              i++;
            }
          }
        }
      }

      if (found)
      {
        return md;
      }
      else
      {
        return null;
      }
    }

    public static bool IsNeedEngineJson(ConfigMetaData cleansMd)
    {
      //writable must be false for all access level
      int nAccessLevel = AccessLevel.Instance.AvailableAccessLevel.Length;
      bool result = true;
      for (int i = 0; i < nAccessLevel; i++)
      {
        result &= !IsWritable(AccessLevel.Instance.AvailableAccessLevel[i], cleansMd);
      }

      return result;
    }
    public static bool IsWritable(AccessLevelEnum accessLevel, ConfigMetaData cleansMd)
    {
      int c = (int)Math.Pow(2, ((int)accessLevel));
      return ((cleansMd.ReadWriteStatus & c) == c);
    }
  }

}
