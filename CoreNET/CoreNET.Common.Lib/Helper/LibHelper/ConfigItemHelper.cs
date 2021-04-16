using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using System.Threading.Tasks;
using System.Reflection;

namespace CoreNET.Common.Base
{
  public class ConfigItemHelper
  {
    private static ConfigItemHelper _Instance = null;
    public static ConfigItemHelper Instance
    {
      get
      {
        if (_Instance == null)
        {
          _Instance = new ConfigItemHelper();
        }
        return _Instance;
      }
    }
    public static ConfigItem VerifyItem(ConfigItem item)
    {
      //Just Verify

      //This is just demo, because the item values in collection still not completed
      item.DataType = "Integer";
      item.Size = 4;
      item.PrefixUnit = "";
      item.PostfixUnit = "A";
      item.Min = "1";
      item.Max = "1000";

      return item;
    }
    //destobj is destination object
    public static void CopyProperties(object sourceobj, object destobj)
    {
      PropertyInfo[] Props = sourceobj.GetType().GetProperties();
      for (int i = 0; i < Props.Length; i++)
      {
        PropertyInfo prop = Props[i];
        String pname = prop.Name;
        try
        {
          Object value = prop.GetValue(sourceobj, null);
          if (typeof(List<ConfigMetaData>).IsInstanceOfType(value))
          {
            List<ConfigMetaData> listvalue = (List<ConfigMetaData>)value;
            List<ConfigMetaData> newvalue = new List<ConfigMetaData>();
            foreach(ConfigMetaData md in listvalue)
            {
              newvalue.Add((ConfigMetaData)BaseBO.Clone(md));
            }
            destobj.GetType().GetProperty(pname).SetValue(destobj, newvalue);
          }
          else
          {
            destobj.GetType().GetProperty(pname).SetValue(destobj, value);
          }
        }
        catch (Exception)
        {
        }
      }
    }



  }
}
