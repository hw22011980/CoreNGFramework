using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class MessageHelper
  {
    public const int INVALID_METADATA = 1001;
    public static string GetEllapsedTimeMessage(long tick)
    {
      return $"{tick / 10000}ms";
    }

    public static string GetInvalidDataMessage(int code)
    {
      switch (code)
      {
        case INVALID_METADATA:
          return $"Error {code}: Invalid meta data";
        default:
          return "Invalid data";
      }
    }
    public static string SerializeArray(Array array)
    {
      string json = SerializeJSON(array);
      return json.Replace("[", "").Replace("]", "").Replace("\"", "").Replace("\r\n","");
    }
    public static string SerializeJSON(Object obj)
    {
      var jsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings
      {
        NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()

      };
      string json = Newtonsoft.Json.JsonConvert.SerializeObject(obj, Newtonsoft.Json.Formatting.Indented, jsonSerializerSettings);
      return json;
    }
  }
}
