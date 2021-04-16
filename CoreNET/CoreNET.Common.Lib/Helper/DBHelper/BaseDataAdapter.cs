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
  #region BaseDataAdapter
  public class BaseDataAdapter
  {
    public const int MODE_SQLSERVER = 0;
    public const int MODE_SQLCE = 1;
    public static object GetNullValue(System.Reflection.PropertyInfo prop, object val)
    {
      object oTemp = null;
      Type type = val.GetType();

      if (prop.PropertyType == typeof(DateTime))
      {
        oTemp = new DateTime();
      }
      else if (prop.PropertyType == typeof(int))
      {
        oTemp = -1;
      }
      else
      {
        oTemp = BOHelper.GetDefault(prop.PropertyType);
      }
      return oTemp;
    }
    public static List<BaseBO> GetListTreeDC(BaseBO ctrl, string sql, string fieldLevel)
    {
      string[] fields = ctrl.GetFields();
      return GetListTreeDC(ctrl, sql, fieldLevel, fields);
    }
    public static List<BaseBO> GetListTreeDC(BaseBO ctrl, string sql, string fieldLevel, string[] fields)
    {
      string cs = ((BaseBO)ctrl).ConnectionString;
      DbConnection Connection = new SqlConnection(cs);
      DbCommand SelectCmd = new SqlCommand(sql, (SqlConnection)Connection);

      List<BaseBO> list = new List<BaseBO>();
      int max = 0;
      int counter = 0;
      try
      {
        Connection.Open();
        #region Try
        DbDataReader rdr = SelectCmd.ExecuteReader();
        try
        {
          //if (MasterAppConstants.Instance.LimitLoad)
          //{
          //  For Testing only
          //  max = 300;
          //}
          Object prev = null;
          List<string> fList = new List<string>();
          for (int i = 0; i < fields.Length; i++)
          {
            try
            {
              rdr.GetOrdinal(fields[i]);
              fList.Add(fields[i]);
            }
            catch { }
          }

          while (rdr.Read() && (++counter < max || max == 0))
          {
            BaseBO dc = (BaseBO)Activator.CreateInstance(ctrl.GetType());
            for (int i = 0; i < fList.Count; i++)//fList sdh divalidasi
            {
              try
              {
                string pname = fList[i];
                object val = rdr[pname];
                System.Reflection.PropertyInfo prop = dc.GetProperty(pname);
                if (prop.PropertyType == typeof(string))
                {
                  if (prop.CanWrite)
                  {
                    prop.SetValue(dc, (val.GetType() == typeof(DBNull)) ? GetNullValue(prop, val) :
                    (val.GetType() == typeof(string)) ? ((string)val).Trim() : val.ToString().Replace("'", ""), null);
                  }
                }
                else
                {
                  if (prop.CanWrite)
                  {
                    if (val.GetType() == typeof(DBNull))
                    {
                      prop.SetValue(dc, GetNullValue(prop, val), null);
                    }
                    else
                    {
                      BOHelper.SetValueForProperty(dc, pname, val);
                    }
                  }
                }
              }
              catch (Exception ex)
              {
                BOHelper.Log(ex);
              }
            }
            if (prev != null)
            {
              try
              {
                string fieldLevelPrev = (string)prev.GetType().GetProperty(fieldLevel).GetValue(prev, null).ToString();
                string fieldLevelCurrent = (string)dc.GetProperty(fieldLevel).GetValue(dc, null).ToString();
                if (fieldLevelCurrent.StartsWith(fieldLevelPrev))
                {
                  prev.GetType().GetProperty("Type").SetValue(prev, "H", null);
                }
                else
                {
                  prev.GetType().GetProperty("Type").SetValue(prev, "D", null);
                }
              }
              catch (Exception ex)
              {
                BOHelper.Log(ex);
              }
            }

            list.Add(dc);
            prev = dc;
          }
        }
        catch (Exception ex)
        {
          throw new Exception($"Error:{ex.Message}");
        }
        finally
        {
          rdr.Close();
        }
        #endregion
      }
      catch (Exception ex)
      {
        throw new Exception($"Error:{ex.Message}");
      }
      finally
      {
        Connection.Close();
      }
      return list;
    }
    public static List<BaseBO> GetListDC(BaseBO ctrl, string sql)
    {
      string[] fields = ctrl.GetFields();
      return GetListDC(ctrl, sql, fields);
    }
    public static List<BaseBO> GetListDC(BaseBO ctrl, string sql, string[] fields)
    {
      string cs = ((BaseBO)ctrl).ConnectionString;
      DbConnection Connection = new SqlConnection(cs);
      DbCommand SelectCmd = new SqlCommand(sql, (SqlConnection)Connection);

      List<BaseBO> list = new List<BaseBO>();
      #region Loading
      try
      {
        Connection.Open();
        DbDataReader rdr = SelectCmd.ExecuteReader();
        try
        {
          List<string> fList = new List<string>();
          for (int i = 0; i < fields.Length; i++)
          {
            try
            {
              rdr.GetOrdinal(fields[i]);
              fList.Add(fields[i]);
            }
            catch { }
          }
          while (rdr.Read())
          {
            BaseBO dc = (BaseBO)Activator.CreateInstance(ctrl.GetType());
            for (int i = 0; i < fList.Count; i++)
            {
              string pname = fList[i];
              try
              {
                System.Reflection.PropertyInfo prop = dc.GetProperty(pname);
                if (prop != null)
                {
                  object val = rdr[pname];
                  if (prop.PropertyType == typeof(string))
                  {
                    if (prop.CanWrite)
                    {
                      prop.SetValue(dc, (val.GetType() == typeof(DBNull)) ? GetNullValue(prop, val) :
                      (val.GetType() == typeof(string)) ? ((string)val).Trim() : val.ToString().Replace("'", ""), null);
                    }
                  }
                  else
                  {
                    if (prop.CanWrite)
                    {
                      if (val.GetType() == typeof(DBNull))
                      {
                        prop.SetValue(dc, GetNullValue(prop, val), null);
                      }
                      else
                      {
                        BOHelper.SetValueForProperty(dc, pname, val.ToString());
                      }
                    }
                  }
                }
                else
                {
                  throw new Exception(string.Format("No property with name={0}", pname));
                }
              }
              catch (Exception ex)
              {
                BOHelper.Log(ex);
              }
            }
            list.Add(dc);
          }
        }
        catch (Exception ex) { BOHelper.Log(ex); }
      }
      catch (Exception ex)
      {
        ctrl.SetValue("Debug", string.Format(@"
          <br/>Class Name = {0};
          <br/>Call Method = {1};
          <br/>Connection String= {2};
        ", ctrl.GetType().FullName, BOHelper.GetCurrentMethod(1), ((BaseBO)ctrl).ConnectionString));
        BOHelper.Log(ctrl, ex);
        //Exception newex = new Exception(((BaseBO)ctrl).ConnectionString, ex);
      }
      finally
      {
        Connection.Close();
      }
      #endregion
      return list;
    }
    public static List<BaseBO> GetListObject(BaseBO ctrl, string sql)
    {
      return GetListObject(ctrl, sql, ctrl.GetFields());
    }
    public static List<BaseBO> GetListObject(BaseBO ctrl, string sql, string[] fields)
    {
      string cs = ctrl.ConnectionString;
      DbConnection Connection = new SqlConnection(cs);
      DbCommand SelectCmd = new SqlCommand(sql, (SqlConnection)Connection);

      List<BaseBO> list = new List<BaseBO>();
      #region Loading
      try
      {
        Connection.Open();
        DbDataReader rdr = SelectCmd.ExecuteReader();
        try
        {
          List<string> fList = new List<string>();
          for (int i = 0; i < fields.Length; i++)
          {
            try
            {
              rdr.GetOrdinal(fields[i]);
              fList.Add(fields[i]);
            }
            catch { }
          }
          PropertyInfo prop = null;
          while (rdr.Read())
          {
            BaseBO dc = (BaseBO)Activator.CreateInstance(ctrl.GetType());
            for (int i = 0; i < fList.Count; i++)
            {
              try
              {
                string pname = fList[i];
                object val = rdr[pname];
                prop = dc.GetType().GetProperty(pname);
                if (prop.PropertyType == typeof(string))
                {
                  if (prop.CanWrite)
                  {
                    prop.SetValue(dc, (val.GetType() == typeof(DBNull)) ? GetNullValue(prop, val) :
                    (val.GetType() == typeof(string)) ? ((string)val).Trim() : val.ToString().Replace("'", ""), null);
                  }
                }
                else
                {
                  if (prop.CanWrite)
                  {
                    if (val.GetType() == typeof(DBNull))
                    {
                      prop.SetValue(dc, GetNullValue(prop, val), null);
                    }
                    else
                    {
                      BOHelper.SetValueForProperty(dc, pname, val);
                    }
                    //prop.SetValue(dc, (val.GetType() == typeof(DBNull)) ? GetNullValue(prop, val) :
                    //(val.GetType() == typeof(string)) ? ((string)val).Trim() : val, null);
                  }
                }
              }
              catch (Exception ex) { BOHelper.Log(ex); }
            }
            list.Add(dc);
          }
        }
        catch (Exception ex) { BOHelper.Log(ex); }
        {
        }
      }
      catch (Exception ex) { BOHelper.Log(ex); }
      finally
      {
        Connection.Close();
      }
      #endregion
      return list;
    }
    public static void ExecuteCmd(BaseBO ctrl, string sql)
    {
      string cs = ((BaseBO)ctrl).ConnectionString;
      ExecuteCmd(cs, sql);
    }

    #region static
    private static DbCommand CreateCommandObject(string cs)
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
    public static void ExecuteCmd(string cs, string sql)
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
    #endregion
  }
  #endregion
}