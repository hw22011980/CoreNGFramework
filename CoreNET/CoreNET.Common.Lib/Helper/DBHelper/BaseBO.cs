using System;
using System.Collections;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using Newtonsoft.Json;

namespace CoreNET.Common.Base
{
  public class BaseBO
  {
    [JsonIgnore]
    public string ConnectionString { get; set; }

    #region Method
    public BaseBO()
    {
    }
    #region method IsMirror()
    public bool IsMirror(BaseBO mirror)
    {
      bool ismirror = true;
      PropertyInfo[] Props = GetType().GetProperties();
      for (int i = 0; (i < Props.Length) && (ismirror); i++)
      {
        Object value1 = Props[i].GetValue(this, null);
        Object value2 = Props[i].GetValue(mirror, null);
        if (value1 != null)
        {
          ismirror = (value1 == value2);
          if ((value1 != null) && (value2 != null) && !ismirror)
          {
            ismirror = value1.ToString().Trim().Equals(value2.ToString().Trim());
          }
        }
      }
      return ismirror;
    }
    public bool IsEqualValue(BaseBO mirror, string[] keys)
    {
      bool ismirror = true;
      PropertyInfo[] Props = GetType().GetProperties();
      for (int i = 0; (i < keys.Length) && (ismirror); i++)
      {
        Object value1 = GetType().GetProperty(keys[i]).GetValue(this, null);
        Object value2 = GetType().GetProperty(keys[i]).GetValue(mirror, null);
        if (value1 != null)
        {
          ismirror = (value1.Equals(value2));
          if ((value1 != null) && (value2 != null) && !ismirror)
          {
            ismirror = value1.ToString().Trim().Equals(value2.ToString().Trim());
          }
        }
      }
      return ismirror;
    }
    #endregion
    #region method Mirror()
    public void MirrorTo(BaseBO destobj)//destobj is destination object
    {
      Mirror(destobj);
    }
    public void Mirror(BaseBO destobj)//destobj is destination object
    {
      Mirror(destobj, true);
    }
    public void Mirror(BaseBO destobj, bool useReadOnlyFields)//destobj is destination object
    {
      PropertyInfo[] staticProps = destobj.GetType().GetProperties(BindingFlags.Static);
      ArrayList ReadOnlyProps = new ArrayList(staticProps.Length);
      for (int i = 0; i < staticProps.Length; i++)
      {
        ReadOnlyProps.Add(staticProps[i].Name);
      }
      if (useReadOnlyFields)
      {
        string[] notfields = GetNotFields();
        for (int i = 0; i < notfields.Length; i++)
        {
          ReadOnlyProps.Add(notfields[i]);
        }
      }

      //PropertyInfo[] Props = this.GetType().GetProperties();
      PropertyInfo[] Props = destobj.GetType().GetProperties();
      for (int i = 0; i < Props.Length; i++)
      {
        PropertyInfo prop = Props[i];
        if (ReadOnlyProps.IndexOf(prop.Name) < 0)
        {
          String pname = prop.Name;
          try
          {
            if (!pname.ToLower().StartsWith("link")
              && !pname.ToLower().StartsWith("view")
              && !pname.ToLower().EndsWith("str")
              && !pname.ToLower().Contains("debug")
              && !pname.ToLower().Contains("maxmodepreviewindex")//ini klo dikomen, jadi error
              && prop.CanWrite
            )
            {
              Object value = prop.GetValue(this, null);
              destobj.SetValue(pname, value);
            }
          }
          catch (Exception ex)
          {
            string meth = BOHelper.GetCurrentMethod(1);
            string msg = string.Format("Property {0} in class {1}", pname, GetType().FullName);
            BOHelper.Log((BaseBO)this, meth, msg, ex);
          }
        }
      }
    }
    #endregion
    #region method Clone()
    public static BaseBO Clone(BaseBO bo)
    {
      BaseBO newbo = (BaseBO)BOHelper.Create(bo.GetType().AssemblyQualifiedName);
      if (newbo != null)
      {
        ((BaseBO)bo).Mirror(newbo, false);
      }
      return newbo;
    }
    public static BaseBO Clone2<BaseBO>(BaseBO source)
    {
      if (!typeof(BaseBO).IsSerializable)
      {
        throw new ArgumentException("The type must be serializable.", "source");
      }

      // Don't serialize a null object, simply return the default for that object
      if (Object.ReferenceEquals(source, null))
      {
        return default(BaseBO);
      }

      IFormatter formatter = new BinaryFormatter();
      Stream stream = new MemoryStream();
      using (stream)
      {
#pragma warning disable SYSLIB0011 // Type or member is obsolete
        formatter.Serialize(stream, source);
        stream.Seek(0, SeekOrigin.Begin);
        return (BaseBO)formatter.Deserialize(stream);
#pragma warning restore SYSLIB0011 // Type or member is obsolete
      }
    }
    /// <summary>
    /// Clone the object, and returning a reference to a cloned object.
    /// </summary>
    /// <returns>Reference to the new cloned 
    /// object.</returns>
    public object Clone1()
    {
      //First we create an instance of this specific type.
      object newObject = Activator.CreateInstance(GetType());

      //We get the array of fields for the new type instance.
      PropertyInfo[] fields = newObject.GetType().GetProperties();

      //int i = 0;

      //foreach (PropertyInfo fi in this.GetType().GetProperties())
      for (int i = 0; i < fields.Length; i++)
      {
        string pname = fields[i].Name;
        PropertyInfo fi = GetType().GetProperty(pname);
        if (fi.CanWrite)
        {
          //We query if the fiels support the ICloneable interface.
          Type ICloneType = fi.PropertyType.
                      GetInterface("ICloneable", true);

          if (ICloneType != null)
          {
            //Getting the ICloneable interface from the object.
            ICloneable IClone = (ICloneable)fi.GetValue(this, null);

            //We use the clone method to set the new value to the field.
            if (IClone != null)
            {
              if (IClone.GetType() == GetType())
              {

              }
              else
              {
                try
                {
                  fields[i].SetValue(newObject, IClone.Clone(), null);
                }
                catch (Exception ex)
                {
                  throw new Exception("Error on " + fields[i] + " -> " + ex.Message);
                }
              }
            }
          }
          else
          {
            // If the field doesn't support the ICloneable 
            // interface then just set it.
            fields[i].SetValue(newObject, fi.GetValue(this, null), null);
          }

          //Now we check if the object support the 
          //IEnumerable interface, so if it does
          //we need to enumerate all its items and check if 
          //they support the ICloneable interface.
          Type IEnumerableType = fi.PropertyType.GetInterface
                          ("IEnumerable", true);
          if (IEnumerableType != null)
          {
            //Get the IEnumerable interface from the field.
            IEnumerable IEnum = (IEnumerable)fi.GetValue(this, null);

            //This version support the IList and the 
            //IDictionary interfaces to iterate on collections.
            Type IListType = fields[i].PropertyType.GetInterface
                                ("IList", true);
            Type IDicType = fields[i].PropertyType.GetInterface
                                ("IDictionary", true);

            int j = 0;
            if (IListType != null)
            {
              //Getting the IList interface.
              IList list = (IList)fields[i].GetValue(newObject, null);

              foreach (object obj in IEnum)
              {
                //Checking to see if the current item 
                //support the ICloneable interface.
                ICloneType = obj.GetType().
                    GetInterface("ICloneable", true);

                if (ICloneType != null)
                {
                  //If it does support the ICloneable interface, 
                  //we use it to set the clone of
                  //the object in the list.
                  ICloneable clone = (ICloneable)obj;

                  list[j] = clone.Clone();
                }

                //NOTE: If the item in the list is not 
                //support the ICloneable interface then in the 
                //cloned list this item will be the same 
                //item as in the original list
                //(as long as this type is a reference type).

                j++;
              }
            }
            else if (IDicType != null)
            {
              //Getting the dictionary interface.
              IDictionary dic = (IDictionary)fields[i].
                                  GetValue(newObject, null);
              j = 0;
              if (IEnum != null)
              {
                foreach (DictionaryEntry de in IEnum)
                {
                  //Checking to see if the item 
                  //support the ICloneable interface.
                  ICloneType = de.Value.GetType().
                      GetInterface("ICloneable", true);

                  if (ICloneType != null)
                  {
                    ICloneable clone = (ICloneable)de.Value;

                    dic[de.Key] = clone.Clone();
                  }
                  j++;
                }
              }
            }
          }
        }
      }
      return newObject;
    }
    public PropertyInfo GetProperty(string pname)/*Boleh dipake untuk pengecekan ada tidak property, jd jgn ada exception */
    {
      PropertyInfo prop = GetType().GetProperty(pname);
      return prop;//Kalau ngga ada, return null
    }
    public void SetValue(string pname, Object val)
    {
      PropertyInfo prop = GetProperty(pname);
      if (prop == null)
      {
        throw new Exception("Tidak ada property " + pname + " pada class " + GetType().Name + " atau related objectnya!");
      }
      else
      {
        BOHelper.SetValueForProperty(this, pname, val);
        //prop.SetValue(this, val, null);
      }
    }
    public Object GetValue(string pname)
    {
      PropertyInfo prop = GetProperty(pname);
      if (prop == null)
      {
        throw new Exception("Tidak ada property " + pname + " pada class " + GetType().Name + " atau related objectnya!");
      }
      else
      {
        return prop.GetValue(this, null);
      }
    }
    #endregion
    public String[] GetNotFields()
    {
      string[] notfields = new string[] {};
      return notfields;
    }
    public String[] GetFields(ArrayList arListNotFields)
    {
      PropertyInfo[] Props = GetType().GetProperties();
      ArrayList arList = new ArrayList();
      for (int i = 0; i < Props.Length; i++)
      {
        string pname = Props[i].Name;
        if (!arListNotFields.Contains(pname))
        {
          arList.Add(pname);
        }
      }
      string[] fields = new string[arList.Count];
      arList.CopyTo(fields);
      return fields;
    }
    public String[] GetFields()
    {
      ArrayList arListNotFields = new ArrayList(GetNotFields());
      return GetFields(arListNotFields);
    }
    public static Object Create(string className)
    {
      //Get the current assembly object
      Assembly assembly = Assembly.GetExecutingAssembly();

      //Get the name of the assembly (this will include the public token and version number
      AssemblyName assemblyName = assembly.GetName();

      //Use just the name concat to the class chosen to get the type of the object
      Type t = assembly.GetType(assemblyName.Name + "." + className);

      //Create the object, cast it and return it to the caller
      return Activator.CreateInstance(t);
    }
    public void CopyPropertyBOFrom(BaseBO source_bo, string[] props)
    {
      foreach (string pname in props)
      {
        SetValue(pname, source_bo.GetValue(pname));
      }
    }
    public void CopyPropertyBOFrom(BaseBO source_bo)//this is destination, source_bo is source BO
    {
      CopyPropertyBO(source_bo);
    }
    public void CopyPropertyBO(BaseBO source_bo)//this is destination, source_bo is source BO
    {
      if (source_bo != null)
      {
        source_bo.Mirror(this);
      }
    }

    public void CekFields(string[] _Fields)
    {
      for (int i = 0; i < _Fields.Length; i++)
      {
        PropertyInfo prop = GetType().GetProperty(_Fields[i]);
        if (prop == null)
        {
          throw new Exception("Field " + _Fields[i] + " pada Fields tidak terdefinisi!");
        }
      }
    }
    #endregion  
  }
 }


