package com.software_project.service;

import com.software_project.dao.SearchDAO;
import com.software_project.pojo.Search;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchServiceImpl implements SearchService{

    @Autowired
    private SearchDAO searchDAO;

    @Override
    public void insertSearch(Search search) {
        searchDAO.insertSearch(search);
    }

    @Override
    public List<Search> findSearchByEmail(String userEmail) {
        return searchDAO.findSearchByEmail(userEmail);
    }
}
