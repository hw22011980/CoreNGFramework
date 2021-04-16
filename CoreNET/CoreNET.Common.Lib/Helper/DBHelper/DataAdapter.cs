using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Reflection;
using System.Runtime.Serialization;

namespace CoreNET.Common.Base
{
  #region DataAdapter
  public class DataAdapter
  {
    private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
    public const int MODE_SQLSERVER = 0;
    public static List<Dictionary<string, object>> ExecuteSelect(string cs, string sql)
    {
      DbConnection Connection = new SqlConnection(cs);
      DbCommand SelectCmd = new SqlCommand(sql, (SqlConnection)Connection);

      List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
      #region Loading
      try
      {
        Connection.Open();
        DbDataReader rdr = SelectCmd.ExecuteReader();
        try
        {
          while (rdr.Read())
          {
            Dictionary<String, object> row = new Dictionary<string, object>();
            for (int i = 0; i < rdr.FieldCount; i++)
            {
              string pname = rdr.GetName(i);
              object val = rdr[pname];
              if (typeof(DBNull).IsInstanceOfType(val))
              {
                val = null;
              }
              row[pname] = val;
            }
            list.Add(row);
          }
        }
        catch (Exception ex)
        {
          log.Error(ex.StackTrace);
        }
      }
      catch (Exception ex)
      {
        log.Error(ex.StackTrace);
      }
      finally
      {
        Connection.Close();
      }
      #endregion
      return list;
    }

    public static void ExecuteCommand(string cs, string sql)
    {
      using (DbCommand cmd = CreateCommandObject(cs))
      {
        cmd.CommandType = CommandType.Text;
        cmd.CommandText = sql;
        using (DbConnection con = cmd.Connection)
        {
          con.Open();
          int rows = cmd.ExecuteNonQuery();
          con.Close();
        }
      }
    }
    #region private
    private static object GetNullValue(Type PropertyType, object val)
    {
      object oTemp = null;

      if (PropertyType == typeof(DateTime))
      {
        oTemp = new DateTime();
      }
      else if (PropertyType == typeof(int))
      {
        oTemp = -1;
      }
      else
      {
        oTemp = BOHelper.GetDefault(PropertyType);
      }
      return oTemp;
    }
    public static DbCommand CreateCommandObject(string cs)
    {
      DbConnection con = null;
      DbCommand cmd = null;
      con = new SqlConnection(cs);// SQLDataSource.Instance.GetSQLConnection(mode);
      cmd = new System.Data.SqlClient.SqlCommand
      {
        CommandTimeout = 600,
        Connection = (SqlConnection)con
      };
      return cmd;
    }
    #endregion
  }
  #endregion
}