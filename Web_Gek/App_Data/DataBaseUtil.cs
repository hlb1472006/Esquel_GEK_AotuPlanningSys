using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;

namespace Web_Gek.App_Start
{
    public class DataBaseUtil
    {
        public static string connStr = ConfigurationSettings.AppSettings["connstring"];


        /// <summary>
        /// 构建 SqlCommand 对象(用来返回一个结果集，而不是一个整数值)
        /// </summary>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>SqlCommand</returns>
        public static SqlCommand BuildQueryCommand(SqlConnection connection, string storedProcName, IDataParameter[] parameters)
        {

            SqlCommand command = new SqlCommand(storedProcName, connection);
            command.CommandType = CommandType.StoredProcedure;
            foreach (SqlParameter parameter in parameters)
            {
                if (parameter != null)
                {
                    // 检查未分配值的输出参数,将其分配以DBNull.Value.
                    if ((parameter.Direction == ParameterDirection.InputOutput || parameter.Direction == ParameterDirection.Input) &&
                        (parameter.Value == null))
                    {
                        parameter.Value = DBNull.Value;
                    }
                    command.Parameters.Add(parameter);
                }
            }
            return command;
        }
        /// <summary>
        /// 构建执行SQL语句的 SqlCommand 对象(用来返回一个结果集，而不是一个整数值)
        /// </summary>
        /// <param name="connection">database连接</param>
        /// <param name="sqlstr">SQL语句连接字符串</param>
        /// <returns>SqlCommand</returns>
        public static SqlCommand BuildQuerySQLCommand(SqlConnection connection, string sqlstr)
        {
            SqlCommand command = new SqlCommand(sqlstr, connection);
            command.CommandType = CommandType.Text;
            return command;
        }
    }
}
