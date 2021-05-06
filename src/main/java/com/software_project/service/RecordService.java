package com.software_project.service;

import com.software_project.pojo.Record;

import java.util.List;

public interface RecordService {
    List<Record> getRecords(String userEmail, String fundCode);
}
