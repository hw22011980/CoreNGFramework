using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreNET.Common.Base
{
  public class AccessLevel
  {
    public AccessLevelEnum Role { get; set; }
    public AccessLevelEnum[] AvailableAccessLevel { get; set; }
    private static AccessLevel _Instance = null;
    public static AccessLevel Instance
    {
      get
      {
        if (_Instance == null)
        {
          _Instance = new AccessLevel();
          _Instance.AvailableAccessLevel = new AccessLevelEnum[] { AccessLevelEnum.Administrator, AccessLevelEnum.Supervisor, AccessLevelEnum.Operator };
        }
        return _Instance;
      }
    }
    public AccessLevel()
    {
      Role = AccessLevelEnum.Administrator;
    }
    public bool GetReadOnlyStatus(AccessLevelEnum Role, int readWriteStatus)
    {
      bool writable = false;
      switch (Role)
      {
        case AccessLevelEnum.Administrator: writable = ((readWriteStatus & 0x02) == 0x02); break;
        case AccessLevelEnum.Supervisor: writable = ((readWriteStatus & 0x04) == 0x04); break;
        case AccessLevelEnum.Operator: writable = ((readWriteStatus & 0x08) == 0x08); break;
      }
      return !writable;
    }
  }

  public enum AccessLevelEnum : int
  {
    Administrator = 1,
    Supervisor = 2,
    Operator = 3
  }
}
