using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CoreNET.Generator
{
  public partial class Form1 : Form
  {
    public Form1()
    {
      InitializeComponent();
    }

    private void Form1_Load(object sender, EventArgs e)
    {
      this.aPPMENUFIELDSTableAdapter.Fill(this.cORENETDataSet.APPMENUFIELDS);
      this.aPPMENUTableAdapter.Fill(this.cORENETDataSet.APPMENU);
      this.aPPTableAdapter.Fill(this.cORENETDataSet.APP);

      //this.cORENETDataSet.APP.DefaultView.Sort = "KDAPP ASC";
      //this.dataGridView1.DataSource = this.cORENETDataSet.APP.DefaultView;
    }

    private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
    {
      object tag = e.Node.Tag;
      if (tag != null)
      {
        tabControl1.SelectedIndex = int.Parse(tag.ToString());
      }
    }
  }
}
