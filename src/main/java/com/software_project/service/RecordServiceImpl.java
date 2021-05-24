package com.software_project.service;

import com.software_project.dao.RecordDAO;
import com.software_project.pojo.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecordServiceImpl implements RecordService{
    @Autowired
    private RecordDAO recordDAO;

    @Override
    public List<Record> getRecords(String userEmail, String fundCode) {
        return recordDAO.getRecords(userEmail, fundCode);
    }

    @Override
    public List<Record> getRecordsByUserEmail(String userEmail) {
        return recordDAO.getRecordsByUserEmail(userEmail);
    }

    @Override
    public void deleteOneRecord(Record record) {
        recordDAO.deleteOneRecord(record);
    }


}
