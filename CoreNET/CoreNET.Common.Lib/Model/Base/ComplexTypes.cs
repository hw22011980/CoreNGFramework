using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  /// <summary>
  /// Helper to check that a ObisType is a complex type or not
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class ComplexTypes
  {
    public const string TEMPLATE = "Template";
    public const string LOOKUP = "Lookup";

    public const string GORUP_BOX = "GroupBox";
    public const string BIT_STRING = "BitString";
    public const string STRUCTURE = "Structure";
    public const string STRUCT_TABLE = "StructTable";
    public const string ARRAY = "Array";
    public const string TABLE = "Table";
    public const string MULTI_TABLES = "MultiTables"; 
    public const string EOB_CHANNEL = "EoBChannel";
    public const string EOB_SCHEDULE = "EoBSchedule";
    public const string CHANNEL_LIST = "ChannelList";
    public const string MASK_LIST = "MaskList";
    public const string DAY_PROFILE = "DayProfile";
    static List<string> TypeNames = new List<string>(new string[] { BIT_STRING.ToLower(), STRUCTURE.ToLower(), ARRAY.ToLower(), TABLE.ToLower(), STRUCT_TABLE.ToLower(), MULTI_TABLES.ToLower(), CHANNEL_LIST.ToLower() });
    static List<string> StructTypeNames = new List<string>(new string[] { STRUCTURE.ToLower(), STRUCT_TABLE.ToLower() });
    static List<string> ArrayTypeNames = new List<string>(new string[] { ARRAY.ToLower(), TABLE.ToLower() });
    static List<string> MultiTablesTypeNames = new List<string>(new string[] { MULTI_TABLES.ToLower() });
    public static bool IsComplexType(string typeName)
    {
      if (!string.IsNullOrEmpty(typeName))
      {
        return TypeNames.Contains(typeName.ToLower());
      }
      else
      {
        return false;
      }
    }
    public static bool IsStructureType(string typeName)
    {
      if (!string.IsNullOrEmpty(typeName))
      {
        return StructTypeNames.Contains(typeName.ToLower());
      }
      else
      {
        return false;
      }
    }
    public static bool IsArrayType(string typeName)
    {
      if (!string.IsNullOrEmpty(typeName))
      {
        return ArrayTypeNames.Contains(typeName.ToLower());
      }
      else
      {
        return false;
      }
    }
    public static bool IsMultiTablesType(string typeName)
    {
      if (!string.IsNullOrEmpty(typeName))
      {
        return MultiTablesTypeNames.Contains(typeName.ToLower());
      }
      else
      {
        return false;
      }
    }
  }
  public class StageTypes
  {
    static List<string> TypeNames = new List<string>(new string[] { "stagebasic" });
    public static bool IsStageTypes(string typeName)
    {
      return TypeNames.Contains(typeName.ToLower());
    }
  }
}
