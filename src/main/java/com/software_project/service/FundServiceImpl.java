package com.software_project.service;

import com.software_project.dao.FundDAO;
import com.software_project.pojo.Fund;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;


import java.util.List;

@Service
public class FundServiceImpl implements FundService{
    @Autowired
    private FundDAO fundDAO;

    @Override
    public List<Fund> getHoldFund(String email) {
       return fundDAO.holdFund(email);
    }

    @Override
    public List<Fund> searchFundByName(String name) {
        return fundDAO.searchByName(name);
    }

    @Override
    public Fund searchFundByCode(int code) {
        return fundDAO.searchByCode(code);
    }

    @Override
    public Fund insertFund(Fund fund) {
        fundDAO.insertFund(fund);
        return fund;
    }

    @Override
    public void deleteFund(int fundCode) {
        fundDAO.deleteFund(fundCode);
    }

    @Override
    public int getFundsNum() {
        return fundDAO.getFundsNum();
    }

    @Override
    public List<Fund> getAllFunds() {
        return fundDAO.getAllFunds();
//        List<Fund> list = fundDAO.getAllFunds(); //读取数据库数据
//        String[] excelHeader={"基金代码","基金名称","基金类型","基金最小买入金额",
//                "基金原始买入费率","基金当前买入费率","基金经理","基金净值"};  //设置Excel头部
//
//        Workbook wb = new SXSSFWorkbook(1000);

    }
    @Override
    public Workbook exportFund() {
        List<Fund> list = fundDAO.getAllFunds(); //读取数据库数据
        String[] excelHeader={"基金代码","基金名称","基金类型","基金最小买入金额",
                "基金原始买入费率","基金当前买入费率","基金经理","基金净值"};  //设置Excel头部

        Workbook wb = new SXSSFWorkbook(1000);
        Sheet sheet = wb.createSheet("Sheet1");//创建工作表
        Row row = sheet.createRow(0);  //创建行，从0开始
        CellStyle style = wb.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);  //对齐方式
        //导入头部
        for (int i = 0; i < excelHeader.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(excelHeader[i]);
            cell.setCellStyle(style);
//            sheet.setColumnWidth(0, (short) 6000);  //设置列宽
        }
        Fund fund = null;
        //导入数据
        for(int i=0 ; i<list.size();i++){
            row = sheet.createRow(i + 1);
            fund=list.get(i);
            if(i==0){
                System.out.println(fund.getCode());
//                System.out.println(Double.valueOf(fund.getFundCode()));
            }
            row.createCell(0).setCellValue(fund.getCode());   //设置单元格内容
            row.createCell(1).setCellValue(fund.getName());
            row.createCell(2).setCellValue(fund.getType());
            row.createCell(3).setCellValue(fund.getBuyMin());
            row.createCell(4).setCellValue(fund.getBuySourceRate());
            row.createCell(5).setCellValue(fund.getBuyRate());
            row.createCell(6).setCellValue(fund.getManager());
            row.createCell(7).setCellValue(fund.getNetWorth());
        }
        return wb;


    }

    @Override
    public List<Fund> getFundsByPage(int startIndex, int pageSize) {
        return fundDAO.getFundsByPage(startIndex, pageSize);
    }
}
