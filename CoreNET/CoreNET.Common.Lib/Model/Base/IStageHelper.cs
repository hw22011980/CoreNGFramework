using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace CoreNET.Common.Base
{
  public interface IStageHelper
  {
    /// <summary>
    /// Transform from engine payload to mddcs payload
    /// </summary>
    /// <param name="EngineValue">Value comes from UI (engine payload)</param>
    /// <param name="MetaData">Metadata comes from DB to transform engine payload to mddcs payload</param>
    /// <returns>MDDCS value payload ready to send to MDDCS SetObjects</returns>
    ConfigValue ToMddcsPayload(ConfigValue EngineValue, ConfigMetaData MetaData);
    /// <summary>
    /// Transform from mddcs payload to engine payload
    /// </summary>
    /// <param name="values">Value comes from device (MDDCS payload)</param>
    /// <returns>Engine value and metadata payload ready to send to Aurora front end</returns>
    StageData ToEnginePayload(List<ConfigValue> values);
    /// <summary>
    /// Transform from mddcs payload to main payload of engine payload. 
    /// Designed to be called inside ToEnginePayload(), not others methods
    /// </summary>
    /// <returns>Main engine value inside engine payload</returns>
    StageData ToMainPayload();
    /// <summary>
    /// Transform from mddcs payload to temporary lookup payload used to populate available values in main payload. 
    /// Designed to be called inside ToEnginePayload(), not others methods
    /// </summary>
    /// <returns>Lookup engine value used for avaiable values in engine metadata</returns>
    StageData ToLookupPayload();
    /// <summary>
    /// Get main value from array of mddcs value
    /// </summary>
    /// <param name="i">Index metadata from list of OBIS items</param>
    /// <param name="metadata">Input metadata from database</param>
    /// <param name="data">array of mddcs values</param>
    /// <returns>Main mddcs value</returns>
    ConfigValue GetValue(int i, StageData metadata, List<ConfigValue> data, bool isOnline = true);
    /// <summary>
    /// Get main value from array of mddcs value
    /// </summary>
    /// <param name="i">Index metadata from list of OBIS items</param>
    /// <param name="metadata">Input metadata from database</param>
    /// <param name="data">array of mddcs values</param>
    /// <returns>Main mddcs value</returns>
    ConfigValue GetValueOffline(int i, StageData metadata, List<ConfigValue> data);
    bool ValidateValue(int deviceId, bool online, out string message);
    //StageData ValidateMetadata(StageData data);
  }
}
