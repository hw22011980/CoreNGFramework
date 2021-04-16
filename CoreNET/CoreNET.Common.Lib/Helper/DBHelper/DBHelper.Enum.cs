using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public partial class DBHelper
  {
    public List<AvailableValue> GetEnum(int modelID, string group, int filter)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_DeviceEnum_get {modelID}, {group}, {filter}
          ";
      AvailableValue bo = new AvailableValue() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      List<AvailableValue> data = list.ConvertAll<AvailableValue>(new Converter<BaseBO, AvailableValue>(
        delegate (BaseBO par)
        {
          return (AvailableValue)par;
        }
      ));

      return data;
    }
  }
}
