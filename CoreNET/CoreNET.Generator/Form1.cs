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
    int selectIndex;
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

    private void btAdd_Click(object sender, EventArgs e)
    {
        cORENETDataSet.APP.AddAPPRow(tbKdApp.Text, tbIdApp.Text, tbNmApp.Text, tbUrlApp.Text, cbStatusApp.SelectedIndex, Convert.ToInt16(cbLevelApp.SelectedIndex), "D");
        this.aPPTableAdapter.Update(this.cORENETDataSet.APP);
    }

    private void dgApp_CellClick(object sender, DataGridViewCellEventArgs e)
    {
        selectIndex = e.RowIndex;
        tbKdApp.Text = dgApp.Rows[e.RowIndex].Cells[0].Value.ToString();
        tbIdApp.Text= dgApp.Rows[e.RowIndex].Cells[1].Value.ToString();
        tbNmApp.Text= dgApp.Rows[e.RowIndex].Cells[2].Value.ToString();
        tbUrlApp.Text= dgApp.Rows[e.RowIndex].Cells[3].Value.ToString();
    }

    private void btHapus_Click(object sender, EventArgs e)
    {
        if (selectIndex != -1)
        {
            dgApp.Rows.RemoveAt(selectIndex);
            this.aPPTableAdapter.Update(this.cORENETDataSet.APP);
            selectIndex = -1;
            dgApp.CurrentCell = null;
        }
        else
        {
            MessageBox.Show("Pilih data yang ingin dihapus dahulu");
        }
    }

    private void btEdit_Click(object sender, EventArgs e)
    {
        if (selectIndex != -1)
        {
            dgApp.Rows[selectIndex].Cells[0].Value = tbKdApp.Text;
            dgApp.Rows[selectIndex].Cells[1].Value = tbIdApp.Text;
            dgApp.Rows[selectIndex].Cells[2].Value = tbNmApp.Text;
            dgApp.Rows[selectIndex].Cells[3].Value = tbUrlApp.Text;
            this.aPPTableAdapter.Update(this.cORENETDataSet.APP);
            selectIndex = -1;
            dgApp.CurrentCell = null;
        }
        else
        {
            MessageBox.Show("Pilih data yang ingin dihapus dahulu");
        }
    }
  }
}
