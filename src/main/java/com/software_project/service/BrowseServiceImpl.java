package com.software_project.service;

import com.software_project.dao.BrowseDAO;
import com.software_project.pojo.Browse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrowseServiceImpl implements BrowseService{
    @Autowired
    private BrowseDAO browseDAO;


    @Override
    public void insertBrowse(Browse browse) {
        browseDAO.insertBrowse(browse);
    }

    @Override
    public List<Browse> findBrowseByEmail(String userEmail) {
        return browseDAO.findBrowseByEmail(userEmail);
    }

    @Override
    public void deleteBrowse(String userEmail) {
        browseDAO.deleteBrowse(userEmail);
    }

    @Override
    public void deleteOneBrowse(Browse browse) {
        browseDAO.deleteOneBrowse(browse);
    }
}
