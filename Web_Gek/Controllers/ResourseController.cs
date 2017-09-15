using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using System.Data;
using Web_Gek.Models;
using Web_Gek.App_Start;


namespace Web_Gek.Controllers
{
    public class ResourseController:ApiController
    {
        public IEnumerable<Resourse> GETRESOURSEDATA()
        {
            List<Resourse> resourselist = new List<Resourse>();
            SqlConnection cnn = new SqlConnection(DataBaseUtil.connStr);
            cnn.Open();
            SqlCommand comm = DataBaseUtil.BuildQuerySQLCommand(cnn, "select * from dbo.resourse");
            SqlDataReader rd = comm.ExecuteReader();
            while (rd.Read())
            {
                Resourse temp = new Resourse();
                temp.processID = Convert.ToInt32(rd.GetSqlValue(rd.GetOrdinal("processID")).ToString());
                temp.process = Convert.ToString(rd.GetSqlValue(rd.GetOrdinal("process")).ToString());
                temp.type = Convert.ToString(rd.GetSqlValue(rd.GetOrdinal("type")).ToString());
                temp.capacity = Convert.ToInt32(rd.GetSqlValue(rd.GetOrdinal("capacity")).ToString());
                resourselist.Add(temp);
            }
            rd.Close();
            if (cnn.State == ConnectionState.Open)
            {
                cnn.Close();
            }
            return resourselist;
        }
    }
}