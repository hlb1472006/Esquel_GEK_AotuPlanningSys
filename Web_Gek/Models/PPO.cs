using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web_Gek.Models
{
    public class PPO
    {
        public int ppo_id { get; set; }
        public string ppo_no { get; set; }
        public string customer { get; set; }
        public DateTime receive_Date { get; set; }
        public DateTime produce_del_Date { get; set; }
        public string type { get; set; }
        public string operation { get; set; }
        public string finishing_Desc { get; set; }
        public float weight { get; set; }


    }
}