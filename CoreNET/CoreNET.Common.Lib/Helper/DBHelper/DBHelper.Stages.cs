using CoreNET.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  public partial class DBHelper
  {
    public StageDef GetDeviceStages(int paramId)
    {
      string cs = ConnectionString;
      string sql = $@"
            select DS.DeviceStageID
                  ,DS.Name as DeviceStageName
                  ,DP.DeviceStageParamID
                  ,DP.Name as DeviceStageParamName
                  ,DP.UITemplate
            from tblDeviceStages DS
            left outer join tblDeviceStageParam DP on DS.DeviceStageID = DP.DeviceStageID 
            where DP.DeviceStageParamID = {paramId}
          ";

      StageDef bo = new StageDef() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        return null;
      }
      else
      {
        List<StageDef> data = list.ConvertAll<StageDef>(new Converter<BaseBO, StageDef>(
          delegate (BaseBO par)
          {
            return (StageDef)par;
          }
        ));
        return ((StageDef)list[0]);
      }
    }
    public List<MenuBO> GetDeviceParam(int modelId, string paramId)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      int stageId;
      if (int.TryParse(paramId, out stageId))
      {
        sql = $@"
                exec sp_devicestageparam_byStageID_get {modelId},{stageId}
          ";
      }
      else
      {
        sql = $@"
                exec sp_devicestageparam_byStageID_get -1
          ";
      }
      MenuBO bo = new MenuBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql, new string[] {
        "Id","Name","UITemplate", "Selected"
      });
      List<MenuBO> data = list.ConvertAll<MenuBO>(new Converter<BaseBO, MenuBO>(
        delegate (BaseBO par)
        {
          return (MenuBO)par;
        }
      ));
      return data;
    }
    public StagesData GetDeviceObisAll(int modelID)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_devicesetupstage_get {modelID}
          ";
      StageMenuBO bo = new StageMenuBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        throw new Exception($"No metadata ");
      }
      StagesData configStages = new StagesData();
      #region Normalization into 3 objects
      foreach (StageMenuBO o in list)
      {
        ConfigStage configStage = null;
        try
        {
          configStage = configStages.Find(obj => obj.Name.Equals(o.StageName));
          if (configStage == null)
          {
            configStage = new ConfigStage();
            configStage.ID = o.DeviceStageId;
            configStage.Name = o.StageName;
            configStages.Add(configStage);
          }
        }
        catch (Exception ex)
        {
          configStage = new ConfigStage();
          configStage.Message = ex.Message + $"on stage='{o.StageName}'";
        }

        StageData param = null;
        try
        {
          param = configStage.Params.Find(obj => obj.Name.Equals(o.StageParamName));
          if (param == null)
          {
            param = new StageData(modelID);
            param.ID = o.DeviceStageParamId.ToString();
            param.Name = o.StageParamName;
            configStage.Params.Add(param);
          }
        }
        catch (Exception ex)
        {
          param = new StageData(modelID);
          param.Message = ex.Message + $"on param='{o.StageParamName}'";
        }
        configStage.Size = configStage.Params.Count;

        ConfigMetaData item = null;
        try
        {
          item = param.Items.ToList().Find(obj => obj.Name.Equals(o.StageObisName));
          if (item == null)
          {
            item = new ConfigMetaData(modelID, o);

            param.Items.Add(item);
          }
        }
        catch (Exception ex)
        {
          item = new ConfigMetaData(modelID);
          item.Message = ex.Message + $"on obis='{o.StageObisName}'";
        }
        param.Size = param.Items.Count;
      }
      #endregion
      return configStages;
    }
    public StagesData GetDeviceObisByStageID(int modelID, int stageid)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_devicesetupstage_byStageID_get {stageid}
          ";
      StageMenuBO bo = new StageMenuBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        throw new Exception($"No metadata with StageID = {stageid}");
      }
      #region Normalization into 3 objects
      StagesData configStages = new StagesData();
      foreach (StageMenuBO o in list)
      {
        ConfigStage configStage = configStages.Find(obj => obj.Name.Equals(o.StageName));
        if (configStage == null)
        {
          configStage = new ConfigStage();
          configStage.ID = o.DeviceStageId;
          configStage.Name = o.StageName;
          configStages.Add(configStage);
        }

        StageData param = configStage.Params.Find(obj => obj.Name.Equals(o.StageParamName));
        if (param == null)
        {
          param = new StageData(modelID);
          param.ID = o.DeviceStageParamId.ToString();
          param.Name = o.StageParamName;
          configStage.Params.Add(param);
          configStage.Size = configStage.Params.Count;
        }

        ConfigMetaData item = param.Items.ToList().Find(obj => obj.Name.Equals(o.StageObisName));
        if (item == null)
        {
          item = new ConfigMetaData(modelID, o);
          param.Items.Add(item);
          param.Size = param.Items.Count;
        }
      }
      #endregion
      return configStages;
    }

    /**
     *  listParams is a StageData from "data"
        {
	        "plantNumber" : "HYMETERTCP",
	        "data" : [
		        { "id":8},
		        { "id":9}
	        ]
        }
     * 
     * 
     */
    public List<StageData> GetDeviceObisByParamsID(int modelID, List<StageData> listParams)
    {
      if (listParams != null)
      {
        for (int i = 0; i < listParams.Count; i++)
        {
          StageData data = listParams[i];
          StageData newdata = GetDeviceObisByParamID(modelID, data.ID);

          if (data.ObjectsRead != null)
          {
            string json = JsonConvert.SerializeObject(data.ObjectsRead);
            if (data.UITemplate == 0)
            {
              ConfigValue newValue = JsonConvert.DeserializeObject<ConfigValue>(json);
              json = JsonConvert.SerializeObject(newValue.Value);
              newValue.Value = JsonConvert.DeserializeObject<StructConfigValue>(json);
              newdata.ObjectsRead = newValue;
            }
            else
            {
              RootConfigValue newValue = JsonConvert.DeserializeObject<RootConfigValue>(json);
              newdata.ObjectsRead = newValue;
            }
          }
          listParams[i] = newdata;
        }
        return listParams;
      }
      else
      {
        List<StageData> newList = new List<StageData>();
        List<MenuBO> menus = GetDeviceParam(modelID, "-1");
        for (int i = 0; i < menus.Count; i++)
        {
          MenuBO data = menus[i];
          StageData newdata = GetDeviceObisByParamID(modelID, data.Idapp);
          newList.Add(newdata);
        }
        return newList;
      }
    }
    public StageData GetDeviceObisByParamID(int modelID, string paramId)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_devicesetupstage_byStageParamID_get {paramId}
          ";
      StageMenuBO bo = new StageMenuBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        throw new Exception($"No metadata with ParamID = {paramId}");
      }
      bo = (StageMenuBO)list[0];
      StageData data = new StageData(modelID)
      {
        Size = list.Count,
        ID = paramId.ToString(),
        Name = bo.StageParamName,
        ReadWriteStatus = bo.StageReadWriteStatus,
        ReadOnly = AccessLevel.Instance.GetReadOnlyStatus(AccessLevelEnum.Administrator, bo.StageReadWriteStatus),
        UITemplate = bo.UITemplate,
        Message = bo.Message
      };
      foreach (StageMenuBO o in list)
      {
        ConfigMetaData item = new ConfigMetaData(modelID, o);
        item.Size = (item.Items == null) ? item.Size : item.Items.Count;
        data.Items.Add(item);
      }
      return data;
    }
    public ConfigMetaData GetDeviceObisByID(int modelID, int obisId)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_devicesetupstage_byStageObisID_get {obisId}
          ";
      StageMenuBO bo = new StageMenuBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        throw new Exception($"No metadata with ObisID = {obisId}");
      }
      bo = (StageMenuBO)list[0];
      ConfigMetaData item = new ConfigMetaData(modelID, bo);
      return item;
    }

    public List<StageValueBO> GetDeviceObisDetailByObisID(int obisId)
    {
      string cs = ConnectionString;
      string sql = string.Empty;
      sql = $@"
            exec sp_devicesetupstagedetail_byStageObisID_get {obisId}
          ";
      StageValueBO bo = new StageValueBO() { ConnectionString = cs };
      List<BaseBO> list = BaseDataAdapter.GetListObject(bo, sql);
      if (list.Count == 0)
      {
        throw new Exception($"No detail metadata with ObisID = {obisId}");
      }
      List<StageValueBO> data = list.ConvertAll<StageValueBO>(new Converter<BaseBO, StageValueBO>(
        delegate (BaseBO par)
        {
          return (StageValueBO)par;
        }
      ));
      return data;
    }

  }
}
