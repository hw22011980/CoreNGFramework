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
  /// Payload for avalablevalues in metadata
  /// Helper to construct List of AvailableValue from string or tblEnum
  /// </summary>
  /// <remarks>
  /// Used in DBHelper and SetupController
  /// </remarks>  
  public class AvailableValue : BaseBO
  {
    public string Name { get; set; }
    public object Value { get; set; }
    public string Label { get; set; }
    [JsonIgnore]
    public short DisplayStatus { get; set; }

    const string SEMI_COLON = ";";
    const string DASH = "-";
    const string PIPE_LINE = "|";
    /**
     * Compatible Format:
     * 1;2;3;5 => [{Name = 1, Value=1},{Name = 2, Value=2},{Name = 3, Value=3},{Name = 5, Value=5}]
     * 1-3;5 => [{Name = 1, Value=1},{Name = 2, Value=2},{Name = 3, Value=3},{Name = 5, Value=5}]
     */
    public static List<AvailableValue> SetAvailableValues(int modelID, string enumgroup, string availablevalue)
    {
      List<AvailableValue> listAV = null;
      if (!string.IsNullOrEmpty(enumgroup))
      {
        #region Enum
        //Refactor and move logic to SPROC sp_DeviceEnum_get, so can maintain dynamically
        listAV = DBHelper.Instance.GetEnum(modelID, enumgroup,1);
        #endregion
      }
      else
      {
        #region AvailableValues
        listAV = AvailableValue.CreateFromString(availablevalue);
        #endregion
      }
      return (listAV.Count == 0) ? null : listAV;


    }

    private static List<AvailableValue> CreateFromString(string str)
    {
      string[] ar_values = str.Split(new string[] { SEMI_COLON }, StringSplitOptions.RemoveEmptyEntries);
      List<AvailableValue> listAV = new List<AvailableValue>();
      for (int i = 0; i < ar_values.Length; i++)
      {
        if (ar_values[i].Contains(DASH))
        {
          listAV.AddRange(CreateArrayFromDash(ar_values[i]));
        }
        else
        {
          listAV.Add(new AvailableValue() { Name = ar_values[i], Value = ar_values[i] });
        }
      }
      return listAV;
    }

    private static List<AvailableValue> CreateArrayFromDash(string str)
    {
      string[] ar_values = str.Split(new string[] { DASH }, StringSplitOptions.RemoveEmptyEntries);
      List<AvailableValue> listAV = new List<AvailableValue>();
      int mItem=0, nItem=0;
      if (ar_values.Length == 2 && int.TryParse(ar_values[0], out mItem) && int.TryParse(ar_values[1], out nItem))
      {
        for (int i = mItem; i <= nItem; i++)
        {
          listAV.Add(new AvailableValue() { Name = i.ToString(), Value = i.ToString() });
        }
      }
      return listAV;
    }
  }
}
