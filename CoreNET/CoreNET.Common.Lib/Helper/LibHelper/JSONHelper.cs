using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class JSONHelper
  {
    public static string ToCleanJson(object payload)
    {
      var jsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings
      {
        NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()

      };
      return Newtonsoft.Json.JsonConvert.SerializeObject(payload, Newtonsoft.Json.Formatting.None, jsonSerializerSettings);
    }
    public static string ToBeautifyJson(object payload)
    {
      var jsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings
      {
        NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()

      };
      return Newtonsoft.Json.JsonConvert.SerializeObject(payload, Newtonsoft.Json.Formatting.Indented, jsonSerializerSettings);
    }
  }
}
