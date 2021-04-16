using System;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Management;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;


namespace CoreNET.Common.Base
{
  public class BOHelper
  {
    public static string GetFileVersion(string libname)
    {
      FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(libname);
      string ver = fvi.FileVersion;
      return ver;
    }

    public static string GetBaseClassLibName(object dc)
    {
      Type type = dc.GetType().BaseType;
      return GetClassLibName(type);
    }
    public static string GetClassLibName(object dc)
    {
      Type type = dc.GetType();
      return GetClassLibName(type);
    }
    public static string GetClassLibName(Type type)
    {
      string[] strs = type.AssemblyQualifiedName.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
      string typename = strs[0] + "," + strs[1];
      return typename;
    }
    public static void GetStackMethod(int level, long tick)
    {
      try
      {
        StackTrace st = new StackTrace();
        string msg = string.Empty;
        for (int i = 1; i <= level; i++)
        {
          StackFrame sf = st.GetFrame(i);
          msg += sf.ToString() + "\n";
        }
        msg += "\n" + tick + " milisecond\n\n";
        System.IO.File.AppendAllText("d:\\log.txt", msg);
      }
      catch (Exception ex)
      {
        BOHelper.Log(ex);
      }
    }

    public static void Log(Exception ex)
    {
      string methname = BOHelper.GetCurrentMethod(1);
      Log(null, methname, string.Empty, ex);
    }
    public static void Log(BaseBO bo, Exception ex)
    {
      string methname = BOHelper.GetCurrentMethod(1);
      if (bo != null)
      {
        Log(bo, methname, (string)bo.GetValue("Debug"), ex);
      }
      else
      {
        Log(bo, methname, string.Empty, ex);
      }
    }
    public static void Log(BaseBO bo, string methname, string debuginfo, Exception ex)
    {
    }
    public static string GetCurrentMethod()
    {
      return GetCurrentMethod(0);
    }
    public static string GetCurrentMethod(int uplevel)
    {
      StackTrace st = new StackTrace();
      StackFrame sf = st.GetFrame(uplevel + 1);
      MethodBase method = sf.GetMethod();
      return method.DeclaringType.Name + "." + method.Name;
    }
    public static string GetMethodsInfo()
    {
      string info = string.Empty;
      StackTrace st = new StackTrace();
      int uplevel = 2;
      StackFrame sf = st.GetFrame(uplevel);
      while (sf != null)
      {
        MethodBase method = sf.GetMethod();
        info += "=>" + (method.DeclaringType != null ? method.DeclaringType.Name : string.Empty) + "." + method.Name;
        sf = st.GetFrame(++uplevel);
      }
      return info;
    }
    public static void SetValueForProperty(Object O, string propname, Object objvalue)
    {
      PropertyInfo Prop = O.GetType().GetProperty(propname);
      if (Prop == null)
      {
        return;
      }

      Object value = null;
      if (typeof(DBNull).IsInstanceOfType(objvalue))
      {
        if (Prop.CanWrite)
        {
          if (!Prop.PropertyType.Equals(typeof(DateTime)))
          {
            if (Prop.PropertyType.Equals(typeof(string)))
            {
              Prop.SetValue(O, string.Empty, null);
            }
            else
            {
              Prop.SetValue(O, null, null);
            }
          }
        }
      }
      else if (typeof(string).IsInstanceOfType(objvalue))
      {
        if (Prop.CanWrite)
        {
          string strValue = objvalue.ToString().Trim();
          if (Prop.PropertyType.Equals(typeof(decimal)))
          {
            strValue = strValue.Replace(".", "");
            strValue = strValue.Replace(",", ".");
          }
          SetValueForProperty(O, propname, (string)objvalue);
        }
      }
      else
      {
        try
        {
          if (Prop.CanWrite)
          {
            if (objvalue != null)
            {
              if ((Prop.PropertyType == typeof(int)) || (Prop.PropertyType == typeof(int?)))
              {
                value = Convert.ToInt32(objvalue);
              }
              else if ((Prop.PropertyType == typeof(short)) || (Prop.PropertyType == typeof(short?)))
              {
                value = Convert.ToInt16(objvalue);
              }
              else if ((Prop.PropertyType == typeof(double)) || (Prop.PropertyType == typeof(double?)))
              {
                value = Convert.ToDouble(objvalue);
              }
              else if ((Prop.PropertyType == typeof(decimal)) || (Prop.PropertyType == typeof(decimal?)))
              {
                value = Convert.ToDecimal(objvalue);
              }
              else if ((Prop.PropertyType == typeof(DateTime)) || (Prop.PropertyType == typeof(DateTime?)))
              {
                value = Convert.ToDateTime(objvalue);
              }
              else
              {
                value = objvalue;
              }
            }
            else
            {
              value = objvalue;
            }
            Prop.SetValue(O, value, null);
          }
        }
        catch (Exception ex)
        {
          ((BaseBO)O).SetValue("Debug", string.Format("Error casting on class '{0}' property '{1}', nilai='{2}'", O.GetType().FullName, propname, objvalue));
          BOHelper.Log((BaseBO)O, ex);
          value = null;
        }
      }
    }
    public static void SetValueForProperty(object obj, string propname, string strvalue)
    {
      PropertyInfo Prop = obj.GetType().GetProperty(propname);
      object value = null;
      if (!(strvalue.Equals("") || (strvalue == null)) || (Prop.PropertyType == typeof(string)))
      {
        try
        {
          if (Prop.PropertyType == typeof(int))
          {
            value = int.Parse(strvalue);
          }
          else if (Prop.PropertyType == typeof(short))
          {
            value = short.Parse(strvalue);
          }
          else if (Prop.PropertyType == typeof(long))
          {
            value = long.Parse(strvalue);
          }
          else if (Prop.PropertyType == typeof(double))
          {
            value = double.Parse(strvalue);
          }
          else if (Prop.PropertyType == typeof(decimal))
          {
            //string temp = strvalue.Replace(",", ".");di Riskmanagement jadi error
            //dipindah di  SetValueForProperty(object obj, string propname, object strvalue)
            value = decimal.Parse(strvalue);
          }
          else if (Prop.PropertyType == typeof(DateTime))
          {
            try
            {
              value = DateTime.Parse(strvalue);
            }
            catch (Exception ex)
            {
              BOHelper.Log(ex);
              try
              {
                value = DateTime.Parse(strvalue.Substring(1, 10));
              }
              catch (Exception ex1)
              {
                BOHelper.Log(ex1);
                if (strvalue.Contains("-"))
                {
                  string[] temps = strvalue.Split(new string[] { "-" }, StringSplitOptions.RemoveEmptyEntries);
                  value = new DateTime(int.Parse(temps[0]), int.Parse(temps[1]), int.Parse(temps[2]));
                }
                else if (strvalue.Contains("/"))
                {
                  string[] temps = strvalue.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                  value = new DateTime(int.Parse(temps[0]), int.Parse(temps[1]), int.Parse(temps[2]));
                }
              }
            }
          }
          else if (Prop.PropertyType == typeof(bool))
          {
            value = bool.Parse(strvalue);
          }
          else
          {
            value = strvalue;
          }
        }
        catch (Exception ex)
        {
          value = null;
          throw new Exception($"Error:{ex.Message}");
        }
        try
        {
          Prop.SetValue(obj, value, null);
        }
        catch (Exception ex)
        {
          BOHelper.Log(ex);
        }
      }
      else
      {
        value = GetDefault(Prop.PropertyType);
        try
        {
          Prop.SetValue(obj, value, null);
        }
        catch (Exception ex)
        {
          BOHelper.Log(ex);
        }
      }

    }
    public static Object GetDefault(Type type)
    {
      if (type == typeof(int))
      {
        return 0;
      }
      else if (type == typeof(bool))
      {
        return false;
      }
      else if (type == typeof(decimal))
      {
        return new decimal(0);
      }
      else if (type == typeof(double))
      {
        return (double)0;
      }
      else if (type == typeof(DateTime))
      {
        return new DateTime();
      }
      else if (type == typeof(string))
      {
        return string.Empty;
      }
      else if (type == typeof(string[]))
      {
        return new string[] { };
      }
      else if (type == typeof(DBNull))
      {
        return DBNull.Value;
      }
      else
      {
        return Activator.CreateInstance(type); ;
      }
    }

    public static BaseBO LoadDataControl(string fname, string strtype)
    {
      BaseBO dc = null;
      Assembly assembly = Assembly.LoadFile(fname);
      foreach (Type type in assembly.GetTypes())
      {
        if (type.FullName.EndsWith(strtype))
        {
          dc = (BaseBO)Activator.CreateInstance(type);
        }
      }
      if (dc == null)
      {
        dc = (BaseBO)Activator.CreateInstance(Type.GetType("Valid49.BO." + strtype));
      }
      return dc;
    }

    public static string FindNearestMatch(ICollection keys, string key)
    {
      foreach (string k in keys)
      {
        if (k.Replace(" ", "").Replace("", "").Replace("'", "").ToLower() == key.Replace(" ", "").Replace("", "").Replace("'", "").ToLower())
        {
          return k;
        }
      }
      return null;
    }

    public static string GetParentCode(string kode)
    {
      try
      {
        if (!kode.Trim().EndsWith("."))
        {
          kode = kode.Trim() + ".";
        }
        int pos1 = kode.LastIndexOf(".", kode.Trim().Length - 2);
        if (pos1 < 0)
        {
          return string.Empty;
        }
        return kode.Trim().Substring(0, pos1 + 1);
      }
      catch (Exception ex)
      {
        BOHelper.Log(ex);
        return string.Empty;
      }

    }
    public static String IntToStr(long n, int len)
    {
      if (len < 0)
      {
        return string.Empty;
      }
      else if (len == 0)
      {
        return n + "";
      }
      else
      {
        String s = n + "";
        for (int i = s.Length; i < len; i++)
        {
          s = "0" + s;
        }
        return s;
      }
    }
    /*
     * 
     * */
    public static void SetDate(int year, int n, out DateTime Tgl1, out DateTime Tgl2)
    {
      int month = DateTime.Now.Month;
      SetDate(year, month, n, out Tgl1, out Tgl2);
    }
    public static void SetDate(int year, int month, int n, out DateTime Tgl1, out DateTime Tgl2)
    {
      switch (n)
      {
        case 1://Year
          Tgl1 = new DateTime(year, 1, 1);
          Tgl2 = new DateTime(year, 12, 31);
          break;
        case 2://Half Year
          int m2 = ((month - 1) / 6 + 1) * 6 - 5;
          int n2 = ((month - 1) / 6 + 1) * 6;
          Tgl1 = new DateTime(year, m2, 1);
          Tgl2 = new DateTime(year, n2, DateTime.DaysInMonth(year, n2));
          break;
        case 3://Quarter Year
          int m3 = ((month - 1) / 3 + 1) * 3 - 2;
          int n3 = ((month - 1) / 3 + 1) * 3;
          Tgl1 = new DateTime(year, m3, 1);
          Tgl2 = new DateTime(year, n3, DateTime.DaysInMonth(year, n3));
          break;
        case 4://Month
          Tgl1 = new DateTime(year, month, 1);
          Tgl2 = new DateTime(year, month, DateTime.DaysInMonth(year, month));
          break;
        default:
          Tgl1 = new DateTime(year, month, DateTime.Now.Day);
          Tgl2 = new DateTime(year, month, DateTime.Now.Day);
          break;
      }
    }
    public static void GenerateCSV(IList list, string fname, string[] props)
    {
      using (StreamWriter sw = new StreamWriter(fname))
      {
        foreach (BaseBO dp in list)
        {
          string line = "";
          for (int i = 0; i < props.Length; i++)
          {
            object obj = dp.GetType().GetProperty(props[i]).GetValue(dp, null);
            string str = "";
            if ((obj != null) && (obj.GetType() == typeof(string)))
            {
              str = (string)obj;
              if (str.EndsWith("."))
              {
                str = str.Substring(0, str.Length - 1);
              }
            }
            else if ((obj != null) && (obj.GetType() == typeof(decimal)))
            {
              str = ((decimal)obj).ToString();
              str = str.Replace(",", ".");
            }
            line += str;
            if (i < props.Length - 1)
            {
              line += ";";
            }
          }
          sw.WriteLine(line);
        }
      }
    }
    public static string GetInitkey(string key)
    {
      return GetDotNetHash(key + "19490807", 16);
    }
    public static BaseBO Create(string fullclassname)
    {
      BaseBO obj = null;
      try
      {
        if (!string.IsNullOrEmpty(fullclassname))
        {
          Type T = Type.GetType(fullclassname);
          obj = Activator.CreateInstance(T) as BaseBO;
        }
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message + " on classname=" + fullclassname);
      }
      return obj;
    }

    public static string GetMACAddress()
    {
      string macaddr = String.Empty;
      IPGlobalProperties computerProperties = IPGlobalProperties.GetIPGlobalProperties();
      NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();
      Console.WriteLine("Interface information for {0}.{1}     ",
              computerProperties.HostName, computerProperties.DomainName);
      if (nics == null || nics.Length < 1)
      {
        return string.Empty;
      }

      //search Ethernet Adapter
      bool found = false;
      int i = 0;
      NetworkInterface adapter = null;
      while ((i < nics.Length) && (!found))
      {
        adapter = nics[i];
        if (adapter.NetworkInterfaceType == NetworkInterfaceType.Ethernet)
        {
          found = true;
        }
        else
        {
          i++;
          adapter = null;
        }
      }
      if (adapter == null)
      {
        found = false;
        i = 0;
        adapter = null;
        while ((i < nics.Length) && (!found))
        {
          adapter = nics[i];
          if (adapter.NetworkInterfaceType == NetworkInterfaceType.Ethernet3Megabit)
          {
            found = true;
          }
          else
          {
            i++;
            adapter = null;
          }
        }
      }
      if (adapter == null)
      {
        found = false;
        i = 0;
        adapter = null;
        while ((i < nics.Length) && (!found))
        {
          adapter = nics[i];
          if (adapter.NetworkInterfaceType == NetworkInterfaceType.FastEthernetFx)
          {
            found = true;
          }
          else
          {
            i++;
            adapter = null;
          }
        }
      }
      if (adapter == null)
      {
        found = false;
        i = 0;
        adapter = null;
        while ((i < nics.Length) && (!found))
        {
          adapter = nics[i];
          if (adapter.NetworkInterfaceType == NetworkInterfaceType.FastEthernetT)
          {
            found = true;
          }
          else
          {
            i++;
            adapter = null;
          }
        }
      }
      if (adapter == null)
      {
        found = false;
        i = 0;
        adapter = null;
        while ((i < nics.Length) && (!found))
        {
          adapter = nics[i];
          if (adapter.NetworkInterfaceType == NetworkInterfaceType.Wireless80211)
          {
            found = true;
          }
          else
          {
            i++;
            adapter = null;
          }
        }
      }

      if (adapter != null)
      {
        PhysicalAddress address = adapter.GetPhysicalAddress();
        byte[] bytes = address.GetAddressBytes();
        for (i = 0; i < bytes.Length; i++)
        {
          macaddr += bytes[i].ToString("X2");
          if (i != bytes.Length - 1)
          {
          }
        }
        return macaddr;
      }
      else
      {
        return string.Empty;
      }
    }
    public static string GeneratePwdEDMI(string cpuid)
    {
      string Initkey = BOHelper.GetDotNetHash("EDMI", 16);
      return BOHelper.GetPwdDb(Initkey, cpuid);
    }
    public static string GetPwdDb(string key, string cpuid)
    {
      string pwd = BOHelper.GetDotNetHash(key + cpuid, 16);
      return pwd;
    }
    public static string GetRandomPassword(string challenge)
    {
      return GetDotNetHash(challenge, 8);
    }
    public static string GetHexStringForStorePwd(string input)
    {
      byte[] inputSalt, inputHash;
      using (HMACSHA256 hmac = new HMACSHA256())
      {
        inputSalt = hmac.Key;
        inputHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
      }
      return $"{Convert.ToBase64String(inputSalt)}:{Convert.ToBase64String(inputHash)}";
    }
    public static bool Validate(string hashedInput, string input)
    {
      string[] parts = hashedInput.Split(':');
      byte[] inputSalt = Convert.FromBase64String(parts[0]);
      byte[] inputHash = Convert.FromBase64String(parts[1]);
      using (HMACSHA256 hmac = new HMACSHA256(inputSalt))
      {
        byte[] computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
        for (int i = 0; i < computedHash.Length; i++)
        {
          if (computedHash[i] != inputHash[i])
          {
            return false;
          }
        }
        return true;
      }
    }
    public static string GetDotNetHash(string challenge, int length)
    {
      int hash = challenge.GetHashCode();
      string code = hash.ToString("X2");
      if (code.Length > length)
      {
        return code.Substring(0, length);
      }
      else
      {
        return code + IntToStr(0, length - code.Length - 1);
      }

    }
    public static string GetPwdMD5ResponseOnly(string initsecret)
    {
      DateTime cnow = DateTime.Now;
      long day = cnow.DayOfYear * 86400;
      long year = (cnow.Year - 2000) * 365 * 86400;
      long hour = cnow.Hour * 3600;
      long minute = cnow.Minute * 60;
      long totdetik = day + year + hour + minute + cnow.Second;

      string epoc = totdetik + initsecret;

      MD5 md5 = new MD5CryptoServiceProvider();
      byte[] result = md5.ComputeHash(Encoding.ASCII.GetBytes(epoc));

      StringBuilder sb = new StringBuilder();
      for (int i = 0; i < result.Length; i++)
      {
        sb.Append(result[i].ToString("X2"));
      }
      return sb.ToString();
    }
    public static void SetNull(Object obj)
    {
      if (obj == null)
      {
        return;
      }

      Type typ = obj.GetType().GetInterface("IDisposable", true);
      if (typ != null)
      {
        ((IDisposable)obj).Dispose();
        return;
      }
      if (obj.GetType() == typeof(DateTime))
      {
        obj = null;
        return;
      }
      if (obj.GetType() == typeof(String[]))
      {
        for (int i = 0; i < ((Array)obj).Length; i++)
        {
          SetNull(((Array)obj).GetValue(i));
        }
        return;
      }
      //todo gimana remove data array, harus dilooping dong
      PropertyInfo[] props = obj.GetType().GetProperties();
      if ((props == null) || (props.Length == 0))
      {
        obj = null;
      }
      else
      {
        for (int i = 0; i < props.Length; i++)
        {
          try
          {
            Object val = props[i].GetValue(obj, null);
            if (val.GetType() == typeof(DateTime))
            {
              val = null;
            }
            else
            {
              SetNull(val);
            }
          }
          catch (Exception ex)
          {
            BOHelper.Log(ex);
          }
        }
      }
    }
    public static void CopyFields(BaseBO obj1, BaseBO obj2)
    {
      string[] fields = obj1.GetFields();
      for (int i = 0; i < fields.Length; i++)
      {
        Object o = obj1.GetType().GetProperty(fields[i]).GetValue(obj1, null);
        try
        {
          obj2.GetType().GetProperty(fields[i]).SetValue(obj2, o, null);
        }
        catch (Exception ex)
        {
          BOHelper.Log(ex);
        }
      }
    }
  }
}
