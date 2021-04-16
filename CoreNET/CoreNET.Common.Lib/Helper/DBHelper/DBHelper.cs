using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace CoreNET.Common.Base
{
  public partial class DBHelper
  {
    public const int SELECT_ALL = 0;
    public const int SELECT_BY_ID = 1;
    public const int SELECT_BY_COLUMN = 20;
    public const int SELECT_BY_COLUMN_1 = 21;
    public const int SELECT_BY_COLUMN_2 = 22;
    public const int INSERT = 11;
    public const int UPDATE = 12;
    public const int DELETE = 13;
    public byte IsOriginal { get; set; }
    public int LanguageID { get; set; }
    public string ConnectionString { get; set; }
    private static DBHelper _Instance = null;
    public static DBHelper Instance
    {
      get
      {
        if (_Instance == null)
        {
          _Instance = new DBHelper();
          string SQLInstance = ConfigurationManager.AppSettings["DBDataSource"];
          string db = ConfigurationManager.AppSettings["DBName"];
          string user = ConfigurationManager.AppSettings["DBUserName"];
          string pwd = ConfigurationManager.AppSettings["DBPassword"];
          string cs = string.Format($"data source={SQLInstance};initial catalog={db};user id={user};password={pwd}");
          _Instance.ConnectionString = cs;
          _Instance.IsOriginal = 1;
          _Instance.LanguageID = 0;
        }
        return _Instance;
      }
    }
  }

  /*
  select * from tblDeviceStages
  select '$'+cast(DeviceStageParamID as nvarchar(5)) as ID, Name 
            from tblDeviceStageParam
  select * from tblDeviceStageParam where DeviceStageID=3
  select * from tblDeviceStageObis

  exec sp_devicesetupstage_get 24
  exec sp_devicesetupstage_byStageID_get 24, 1
  exec sp_devicesetupstage_byStageID_get 24, 3
  exec sp_devicesetupstage_byStageParamID_get 24, 9
  exec sp_devicesetupstage_byStageObisID_get 24, 19


  select LD.DLMSAssociation_ID, LD.Device_ID, D.PlantNumber, D.SerialNumber, D.DeviceTypeId
  ,DC.IPAddress,DC.Port,LD.KEK as EK, LD.AK, LD.Password
  from tblLnkDeviceDLMSAssociation  LD
  inner join tblDeviceComms DC on LD.Device_ID= DC.Device_Id
  inner join tblDevices D on LD.Device_ID = D.Device_ID 
  where PlantNumber= '{plantNumber}'

  select '$'+cast(DeviceStageParamID as nvarchar(5)) as ID, Name 
  from tblDeviceStageParam
  where DeviceStageID={stageId}


  select DeviceStageID as ID, Name 
  from tblDeviceStages where DeviceStageID={stageId}

  exec sp_devicesetupstage_byStageParamID_get 24, 21
  exec sp_devicesetupstage_byStageObisID_get 24, 39

  exec sp_devicesetupstagedetail_byStageObisID_get 39
*/

}
