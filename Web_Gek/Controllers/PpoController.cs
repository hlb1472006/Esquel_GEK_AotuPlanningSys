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
    public class PpoController:ApiController
    {
        public IEnumerable<PPO> GETPPODATA()
        {
            string str = "select ppo_no,customer,receive_date,produce_del_date,operation,quality_code,sum(weight) Weight from dbo.ppo where(quality_code like 'F%'or quality_code like 'C%')and type = '已做工艺'group by ppo_no,customer,receive_date,produce_del_date,operation,quality_code";
            List<PPO> ppolist = new List<PPO>();
            SqlConnection cnn = new SqlConnection(DataBaseUtil.connStr);
            cnn.Open();
            SqlCommand comm = DataBaseUtil.BuildQuerySQLCommand(cnn, str);
            SqlDataReader rd = comm.ExecuteReader();
            int i = 1;
            while (rd.Read())
            {
                PPO temp = new PPO();
                temp.ppo_id = i;
                temp.ppo_no = Convert.ToString(rd.GetSqlValue(rd.GetOrdinal("ppo_no")).ToString());
                temp.customer = Convert.ToString(rd.GetSqlValue(rd.GetOrdinal("customer")).ToString());
                temp.receive_Date = Convert.ToDateTime(rd.GetSqlValue(rd.GetOrdinal("receive_date")).ToString());
                temp.produce_del_Date = Convert.ToDateTime(rd.GetSqlValue(rd.GetOrdinal("produce_del_date")).ToString());
                temp.type = Convert.ToString((rd.GetSqlValue(rd.GetOrdinal("quality_code")).ToString()).Substring(0,1));
                temp.operation = Convert.ToString(rd.GetSqlValue(rd.GetOrdinal("operation")).ToString());
                temp.weight = Convert.ToSingle(rd.GetSqlValue(rd.GetOrdinal("Weight")).ToString());
                ppolist.Add(temp);
                i++;
            }
            rd.Close();
            if (cnn.State == ConnectionState.Open)
            {
                cnn.Close();
            }
            return ppolist;
        }
    }
}