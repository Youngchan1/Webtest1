package com.dsinfo;

import java.sql.*;

import sun.misc.*;
 
public class dbConnectionTest {
/**
* @param args
* @throws ClassNotFoundException 
* @throws SQLException 
*/
public static void main(String[] args) throws ClassNotFoundException, SQLException {

	String connectionUrl = "jdbc:sqlserver://localhost:1433;databaseName=KYCDB";
//(db서버가 따로 존재한다면 로컬호스트:포트번호 대신 서버아이피:포트번호 를 입력하면된다.

     // Declare the JDBC objects.
     Connection con = null;
     Statement stmt = null;
     ResultSet rs = null;
  
     try {
        // Establish the connection.
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        System.out.println("Driver okay");
        con = DriverManager.getConnection(connectionUrl,"sa","dudcksdlelqlek");
        System.out.println("Connection Made");
     }
     // Handle any errors that may have occurred.
     catch (Exception e) {
        e.printStackTrace();
     }
 
}
}